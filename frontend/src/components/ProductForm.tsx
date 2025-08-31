'use client';

import React from 'react';
import type { Product } from '@/types'; // We will create this types file next

// Define the props the form will accept
interface ProductFormProps {
  editingProduct: Product | null;
  productName: string;
  setProductName: (name: string) => void;
  productDesc: string;
  setProductDesc: (desc: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  editingProduct,
  productName,
  setProductName,
  productDesc,
  setProductDesc,
  handleSubmit,
  resetForm,
}) => {
  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.formTitle}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
      <input
        type="text"
        placeholder="Product Name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        required
        style={styles.input}
      />
      <textarea
        placeholder="Product Description"
        value={productDesc}
        onChange={(e) => setProductDesc(e.target.value)}
        style={{ ...styles.input, ...styles.textarea }}
      />
      <div>
        <button type="submit" style={styles.button}>
          {editingProduct ? 'Update Product' : 'Add Product'}
        </button>
        {editingProduct && (
          <button type="button" onClick={resetForm} style={{ ...styles.button, ...styles.cancelButton }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

// --- Styles ---
const styles: { [key: string]: React.CSSProperties } = {
  form: {
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    border: '1px solid #e0e0e0',
    padding: '1.5rem',
    borderRadius: '8px',
    backgroundColor: '#333',
    color: 'white',
  },
  formTitle: {
    margin: 0,
    marginBottom: '0.5rem',
    color: 'white',
  },
  input: {
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: 'transparent',
    color: 'white',
  },
  textarea: {
    minHeight: '120px',
    resize: 'vertical',
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: 'white',
    color: 'black',
  },
  cancelButton: {
    marginLeft: '1rem',
    backgroundColor: 'white',
    color: 'black',
  },
};

export default ProductForm;