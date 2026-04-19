/**
 * Spice Haven - Backend Server
 * Node.js + Express server with Supabase integration
 * 
 * Setup Instructions:
 * 1. Install dependencies: npm install express cors dotenv @supabase/supabase-js
 * 2. Create .env file with your Supabase credentials:
 *    SUPABASE_URL=your_supabase_url
 *    SUPABASE_KEY=your_supabase_key
 * 3. Run server: node server.js
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Supabase setup (optional - for database storage)
let supabase;
try {
    const { createClient } = require('@supabase/supabase-js');
    
    if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
        supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
        console.log('✅ Supabase connected successfully');
    } else {
        console.log('⚠️  Supabase not configured. Orders will be logged to console only.');
        console.log('   To enable database storage, add SUPABASE_URL and SUPABASE_KEY to your .env file');
    }
} catch (error) {
    console.log('⚠️  Supabase module not installed. Run: npm install @supabase/supabase-js');
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// In-memory storage (fallback if Supabase is not configured)
const orders = [];

/**
 * POST /api/submit-order
 * Handle order/inquiry form submission
 */
app.post('/api/submit-order', async (req, res) => {
    try {
        const { name, email, phone, product, message } = req.body;
        
        // Validate required fields
        if (!name || !email || !phone || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields'
            });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            });
        }
        
        // Create order object
        const order = {
            id: Date.now(),
            name,
            email,
            phone,
            product: product || 'Not specified',
            message,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        
        // Store in Supabase if configured
        if (supabase) {
            try {
                const { data, error } = await supabase
                    .from('orders')
                    .insert([order]);
                
                if (error) {
                    console.error('Supabase insert error:', error);
                    // Fallback to in-memory storage
                    orders.push(order);
                } else {
                    console.log('✅ Order saved to Supabase:', data);
                }
            } catch (supabaseError) {
                console.error('Supabase connection error:', supabaseError);
                // Fallback to in-memory storage
                orders.push(order);
            }
        } else {
            // Store in memory (fallback)
            orders.push(order);
            console.log('📦 New Order Received (stored in memory):');
            console.log('---'.repeat(20));
            console.log(`ID: ${order.id}`);
            console.log(`Name: ${order.name}`);
            console.log(`Email: ${order.email}`);
            console.log(`Phone: ${order.phone}`);
            console.log(`Product: ${order.product}`);
            console.log(`Message: ${order.message}`);
            console.log(`Timestamp: ${order.timestamp}`);
            console.log('---'.repeat(20));
        }
        
        // Send success response
        res.status(200).json({
            success: true,
            message: 'Order submitted successfully',
            orderId: order.id
        });
        
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing your order. Please try again.'
        });
    }
});

/**
 * GET /api/orders
 * Retrieve all orders (for admin purposes)
 */
app.get('/api/orders', (req, res) => {
    // In a real application, you would add authentication here
    res.status(200).json({
        success: true,
        count: orders.length,
        orders: orders.sort((a, b) => b.id - a.id) // Most recent first
    });
});

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        supabase: supabase ? 'connected' : 'not configured'
    });
});

/**
 * Serve index.html for all other routes (SPA support)
 */
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('\n🌶️  Spice Haven Server Running!');
    console.log('='.repeat(40));
    console.log(`📍 Port: ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`💾 Supabase: ${supabase ? 'Connected' : 'Not Configured'}`);
    console.log('='.repeat(40));
    console.log('\n📝 Available Endpoints:');
    console.log('   POST /api/submit-order - Submit order/inquiry');
    console.log('   GET  /api/orders       - Get all orders');
    console.log('   GET  /health           - Health check');
    console.log('\n✨ Press Ctrl+C to stop the server\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n👋 SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n👋 SIGINT received. Shutting down gracefully...');
    process.exit(0);
});
