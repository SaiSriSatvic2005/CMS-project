'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from '@/components/ProductForm';
import ProductTable from '@/components/productTable';
import type { Product } from '@/types';

const API_URL = 'http://localhost:8080/api/products';

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [productName, setProductName] = useState('');
    const [productDesc, setProductDesc] = useState('');
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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

    const resetForm = () => {
        setEditingProduct(null);
        setProductName('');
        setProductDesc('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const productData = {
            product_name: productName,
            product_desc: productDesc,
            created_by: 'cms_user',
            updated_by: 'cms_user'
        };

        try {
            if (editingProduct) {
                await axios.put(`${API_URL}/${editingProduct.product_id}`, productData);
            } else {
                await axios.post(API_URL, productData);
            }
            resetForm();
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setProductName(product.product_name);
        setProductDesc(product.product_desc);
    };

    const handleDelete = async (productId: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`${API_URL}/${productId}`);
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleStatusChange = async (product: Product, newStatus: Product['status']) => {
        try {
            const updatedProductData = { ...product, status: newStatus, updated_by: 'cms_publisher' };
            await axios.put(`${API_URL}/${product.product_id}`, updatedProductData);
            fetchProducts();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };
    
    return (
        <main style={styles.container}>
            <h1 style={styles.header}>Products Management</h1>
            <ProductForm
                editingProduct={editingProduct}
                productName={productName}
                setProductName={setProductName}
                productDesc={productDesc}
                setProductDesc={setProductDesc}
                handleSubmit={handleSubmit}
                resetForm={resetForm}
            />
            <ProductTable
                products={products}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleStatusChange={handleStatusChange}
            />
        </main>
    );
}

// --- Styles ---
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#1a1a1a',
    color: 'white',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
    color: 'white',
  }
};