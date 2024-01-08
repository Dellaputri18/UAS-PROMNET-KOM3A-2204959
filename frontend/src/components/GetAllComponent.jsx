import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Button, Container, Row, Col, Modal, Card } from 'react-bootstrap';
import InventoryService from '../services/InventoryService';

const customTableClass = "custom-table";

function GetAllComponent() {
  const [originalInventoryItems, setOriginalInventoryItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [inventoryItems, setInventoryItems] = useState([]); // Change the initial state to an empty array
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setInventoryItems(originalInventoryItems);
      setSearchError(null);
    } else {
      searchInventoryByName();
    }
  }, [searchTerm, originalInventoryItems]);

  const fetchInventoryItems = async () => {
    try {
      const response = await InventoryService.getItem();
      setOriginalInventoryItems(response.data);
      setInventoryItems(response.data);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
    }
  };

  const searchInventoryByName = async () => {
    try {
      const encodedSearchTerm = encodeURIComponent(searchTerm);
      const response = await InventoryService.searchItemByName(encodedSearchTerm);
      const searchData = response.data;
  
      setInventoryItems(searchData);
      console.log(searchData);
  
      setSearchError(null);
      // if (searchData && searchData.length > 0) {
      // } else {
      //   setSearchError('No items found.');
      // }
    } catch (error) {
      console.error('Error searching inventory items:', error);
      setSearchError('Error searching items. Please try again.');
    }
  };  

  const handleSearch = () => {
    setSearchTerm('');
    fetchInventoryItems();
  };
  
  const handleView = (itemId) => {
    console.log('Viewing item with ID:', itemId);
    navigate(`/view-inventory/${itemId}`);
  };

  const handleUpdate = (itemId) => {
    console.log('Updating item with ID:', itemId);
    navigate(`/update-item/${itemId}`);
  };

  const handleDeleteConfirmation = (itemId) => {
    setDeleteItemId(itemId);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    try {
      await InventoryService.deleteItem(deleteItemId);

      setInventoryItems((prevItems) =>
        prevItems.filter((item) => item.id !== deleteItemId)
      );

      setDeleteItemId(null);
      setShowConfirmModal(false);
      setShowModal(true);
      console.log(`Delete item with ID: ${deleteItemId}`);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setDeleteItemId(null);
  };

  return (
    <Container className="vh-100 d-flex flex-column mb-5">
      <Row className="justify-content-between align-items-center mb-5 mt-5">
        <Col>
          <h2>Inventory Items</h2>
        </Col>
        <Col xs="auto">
          <div className="d-flex">
            <input
              type="text"
              placeholder="Search by Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              variant="primary"
              className="ms-2"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </Col>
        <Col xs="auto">
          <Link to="/create-inventory">
            <Button variant="success">Create Item</Button>
          </Link>
        </Col>
      </Row>
      <Card>
        <Card.Body>
          {searchError && <p className="text-danger">{searchError}</p>}
          {Array.isArray(inventoryItems) && inventoryItems.length > 0 ? (
            <Table bordered striped responsive="md" className={`${customTableClass} table-hover`}>
              <thead className="table-primary">
                <tr>
                  <th>ID</th>
                  <th>Nama Barang</th>
                  <th>Jumlah</th>
                  <th>Harga Satuan</th>
                  <th>Lokasi</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventoryItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.nama_barang}</td>
                    <td>{item.jumlah}</td>
                    <td>{item.harga_satuan}</td>
                    <td>{item.lokasi}</td>
                    <td className="d-flex justify-content-center">
                      <Button variant="info" className="me-2" onClick={() => handleView(item.id)}>
                        View
                      </Button>
                      <Button variant="warning" className="me-2" onClick={() => handleUpdate(item.id)}>
                        Edit
                      </Button>
                      <Button variant="danger" onClick={() => handleDeleteConfirmation(item.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No items available.</p>
          )}
        </Card.Body>
      </Card>
      <Modal show={showConfirmModal} onHide={handleCloseConfirmModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this item?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Item Deleted</Modal.Title>
        </Modal.Header>
        <Modal.Body>Item has been successfully deleted.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default GetAllComponent;
