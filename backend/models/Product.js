import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: 0
    },
    image: {
        type: String,
        required: [true, 'Product image is required']
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        enum: ['Electronics', 'Clothing', 'Fashion', 'Accessories', 'Beauty', 'Home', 'Books', 'Sports', 'Other']
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    ratings: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    },
    featured: {
  type: Boolean,
  default: false,
},
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Method to check if product is in stock
productSchema.methods.isInStock = function (quantity = 1) {
    return this.stock >= quantity;
};

// Method to reduce stock
productSchema.methods.reduceStock = function (quantity) {
    this.stock -= quantity;
    return this.save();
};

const Product = mongoose.model('Product', productSchema);

export default Product;
