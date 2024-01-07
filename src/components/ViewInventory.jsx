import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Button, Container } from 'react-bootstrap';
import InventoryService from '../services/InventoryService';

function ViewInventory() {
  const { id: routeId } = useParams();
  const [inventoryItem, setInventoryItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventoryItem = async () => {
      try {
        setLoading(true);
        const response = await InventoryService.getItemById(routeId);

        if (response.data && response.data.id) {
          setInventoryItem(response.data);
        } else {
          console.error(`Error: Item not found with ID ${routeId}`);
        }
      } catch (error) {
        console.error('Error fetching inventory item:', error);
      } finally {
        setLoading(false);
      }
    };

    if (routeId) {
      fetchInventoryItem();
    }
  }, [routeId]);

  return (
    <Container className="vh-100 d-flex flex-column align-items-center mt-5">
      {loading ? (
        <div>Loading...</div>
      ) : (
        inventoryItem && (
          <Card style={{ width: '20rem' }} className="shadow my-4">
            <Card.Body>
              <Card.Title className="text-center mb-5">{inventoryItem.nama_barang}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted text-left">ID: {inventoryItem.id}</Card.Subtitle>
              <Card.Text>
                <strong>Jumlah:</strong> {inventoryItem.jumlah}
                <br className="mb-1" />
                <strong>Harga Satuan:</strong> {inventoryItem.harga_satuan}
                <br className="mb-1" />
                <strong>Lokasi:</strong> {inventoryItem.lokasi}
                <br className="mb-1" />
                <strong>Deskripsi:</strong> {inventoryItem.deskripsi}
              </Card.Text>
              <Link to="/" className="btn btn-primary w-100">
                Back to Inventory
              </Link>
            </Card.Body>
          </Card>
        )
      )}
    </Container>
  );
}

export default ViewInventory;
