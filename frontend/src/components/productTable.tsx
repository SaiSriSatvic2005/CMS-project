'use client';

import React from 'react';
import type { Product } from '@/types'; // We will create this types file next

// Define the props the table will accept
interface ProductTableProps {
  products: Product[];
  handleEdit: (product: Product) => void;
  handleDelete: (productId: number) => void;
  handleStatusChange: (product: Product, newStatus: Product['status']) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  handleEdit,
  handleDelete,
  handleStatusChange,
}) => {
  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.product_id}>
              <td style={styles.td}>{product.product_name}</td>
              <td style={styles.td}>{product.product_desc}</td>
              <td style={styles.td}>
                <span style={{ ...styles.status, ...styles[(product.status || 'draft').toLowerCase()] }}>
                  {product.status || 'Unknown'}
                </span>
              </td>
              <td style={{ ...styles.td, ...styles.actionsCell }}>
                <button onClick={() => handleEdit(product)} style={styles.actionButton}>Edit</button>
                <button onClick={() => handleDelete(product.product_id)} style={{ ...styles.actionButton, ...styles.deleteButton }}>Delete</button>
                {product.status !== 'Published' && (
                  <button onClick={() => handleStatusChange(product, 'Published')} style={{ ...styles.actionButton, ...styles.publishButton }}>Publish</button>
                )}
                {product.status !== 'Archived' && (
                  <button onClick={() => handleStatusChange(product, 'Archived')} style={styles.actionButton}>Archive</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- Styles ---
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  table: {
    width: 'auto',
    borderCollapse: 'collapse',
    marginTop: '1rem',
    backgroundColor: '#333',
  },
  th: {
    padding: '12px',
    border: '1px solid #ddd',
    textAlign: 'left',
    backgroundColor: '#333',
    color: 'white',
  },
  td: {
    padding: '12px',
    border: '1px solid #ddd',
    verticalAlign: 'top',
    backgroundColor: '#333',
    color: 'white',
  },
  actionsCell: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  status: {
    padding: '4px 8px',
    borderRadius: '4px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '0.8rem',
  },
  draft: {
    backgroundColor: '#6c757d',
  },
  published: {
    backgroundColor: '#28a745',
  },
  archived: {
    backgroundColor: '#ffc107',
    color: 'black',
  },
  actionButton: {
    padding: '6px 12px',
    cursor: 'pointer',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: 'white',
    color: 'black',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    borderColor: '#dc3545',
  },
  publishButton: {
    backgroundColor: '#28a745',
    color: 'white',
    borderColor: '#28a745',
  },
};


export default ProductTable;