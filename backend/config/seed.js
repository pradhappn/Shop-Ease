import mongoose from 'mongoose';
import Product from '../models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleProducts = [
    {
        name: 'Acene Phone',
        description: 'Latest smartphone with advanced camera technology and 5G connectivity',
        price: 25.00,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        category: 'Electronics',
        stock: 50,
        ratings: { average: 4.5, count: 128 }
    },
    {
        name: 'Product Time',
        description: 'Premium smartwatch with fitness tracking and health monitoring',
        price: 23.00,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        category: 'Electronics',
        stock: 30,
        ratings: { average: 4.3, count: 85 }
    },
    {
        name: 'Manen iPhone',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 38.00,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        category: 'Accessories',
        stock: 75,
        ratings: { average: 4.7, count: 210 }
    },
    {
        name: 'Amazon tiroruss 60',
        description: 'Streaming device for 4K entertainment',
        price: 30.00,
        image: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=400',
        category: 'Electronics',
        stock: 40,
        ratings: { average: 4.4, count: 92 }
    },
    {
        name: 'Marsur iPhone',
        description: 'Premium over-ear headphones with superior sound',
        price: 35.00,
        image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400',
        category: 'Accessories',
        stock: 25,
        ratings: { average: 4.6, count: 156 }
    },
    {
        name: 'Classmeahase',
        description: 'Latest flagship smartphone with premium design',
        price: 18.00,
        image: 'https://images.unsplash.com/photo-1592286927505-b31c5d050772?w=400',
        category: 'Electronics',
        stock: 60,
        ratings: { average: 4.8, count: 305 }
    },
    {
        name: 'Wireless Earbuds Pro',
        description: 'True wireless earbuds with active noise cancellation',
        price: 45.00,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
        category: 'Accessories',
        stock: 100,
        ratings: { average: 4.5, count: 234 }
    },
    {
        name: 'Gaming Laptop Elite',
        description: 'High-performance gaming laptop with RTX graphics',
        price: 1299.00,
        image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
        category: 'Electronics',
        stock: 15,
        ratings: { average: 4.9, count: 87 }
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await Product.deleteMany({});
        console.log('Cleared existing products');

        await Product.insertMany(sampleProducts);
        console.log('✅ Sample products added successfully');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
