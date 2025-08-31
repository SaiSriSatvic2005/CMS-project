'use client'; // This directive tells Next.js that this is a client-side component

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// The base URL for your backend API
const API_URL = 'http://localhost:8080/api/products';

export default function Home() {
    // State variables
    const [products, setProducts] = useState([]);
    const [productName, setProductName] = useState('');
    const [productDesc, setProductDesc] = useState('');
    const [editingProduct, setEditingProduct] = useState(null); // To hold the product being edited

    // Fetch all products when the component loads
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(API_URL);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Handle form submission for adding or editing a product
    const handleSubmit = async (e) => {
        e.preventDefault();
        const productData = {
            product_name: productName,
            product_desc: productDesc,
            // In a real app, user identity would come from an authentication system
            created_by: 'cms_user', 
            updated_by: 'cms_user' 
        };

        try {
            if (editingProduct) {
                // Update existing product
                await axios.put(`${API_URL}/${editingProduct.product_id}`, productData);
            } else {
                // Add new product
                await axios.post(API_URL, productData);
            }
            // Reset form and refetch products
            resetForm();
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    // Handle editing a product
    const handleEdit = (product) => {
        setEditingProduct(product);
        setProductName(product.product_name);
        setProductDesc(product.product_desc);
    };

    // Handle soft deleting a product
    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`${API_URL}/${productId}`, {
                    data: { updated_by: 'cms_admin' }
                });
                fetchProducts(); // Refresh the list
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    // Handle changing the status of a product (e.g., publishing)
    const handleStatusChange = async (product, newStatus) => {
        try {
            const updatedProduct = { ...product, status: newStatus, updated_by: 'cms_publisher' };
            await axios.put(`${API_URL}/${product.product_id}`, updatedProduct);
            fetchProducts();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };
    
    const resetForm = () => {
        setEditingProduct(null);
        setProductName('');
        setProductDesc('');
    };

    return (
        <main style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
            <h1>Products Management</h1>

            {/* Form for Adding/Editing Products */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
                <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <input
                    type="text"
                    placeholder="Product Name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                    style={{ padding: '0.5rem' }}
                />
                <textarea
                    placeholder="Product Description"
                    value={productDesc}
                    onChange={(e) => setProductDesc(e.target.value)}
                    style={{ padding: '0.5rem', minHeight: '100px' }}
                />
                <div>
                    <button type="submit" style={{ padding: '0.5rem 1rem' }}>{editingProduct ? 'Update Product' : 'Add Product'}</button>
                    {editingProduct && <button type="button" onClick={resetForm} style={{ marginLeft: '1rem' }}>Cancel</button>}
                </div>
            </form>

            {/* Table of Existing Products */}
            <h2>Existing Products</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Description</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.product_id}>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{product.product_name}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{product.product_desc}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{product.status}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                <button onClick={() => handleEdit(product)}>Edit</button>
                                <button onClick={() => handleDelete(product.product_id)} style={{backgroundColor: 'salmon'}}>Delete</button>
                                {product.status !== 'Published' && <button onClick={() => handleStatusChange(product, 'Published')} style={{backgroundColor: 'lightgreen'}}>Publish</button>}
                                {product.status !== 'Archived' && <button onClick={() => handleStatusChange(product, 'Archived')}>Archive</button>}
                                {product.status !== 'Draft' && <button onClick={() => handleStatusChange(product, 'Draft')}>Set to Draft</button>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}