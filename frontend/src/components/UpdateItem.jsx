import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import InventoryService from '../services/InventoryService';

function UpdateItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama_barang: '',
    jumlah: '',
    harga_satuan: '',
    lokasi: '',
    deskripsi: '',
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchInventoryItem = async () => {
      try {
        const response = await InventoryService.getItemById(id);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching inventory item:', error);
      }
    };

    fetchInventoryItem();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleIncrement = (field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: String(parseInt(prevData[field], 10) + 1),
    }));
  };

  const handleDecrement = (field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: String(Math.max(parseInt(prevData[field], 10) - 1, 0)),
    }));
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/'); // Navigate back to the inventory list
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await InventoryService.updateItem(formData, id);
      console.log('Item updated successfully');
      handleShowModal(); // Show modal on success
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  return (
    <Container className="vh-100 mt-5">
      <Row className="d-flex align-items-center justify-content-center">
        <Col md={5}>
          <div className="card">
            <div className="card-body rounded-2">
              <h2 className="text-center mb-4">Update Inventory Item</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formNamaBarang">
                  <Form.Label>Nama Barang</Form.Label>
                  <Form.Control
                    type="text"
                    name="nama_barang"
                    value={formData.nama_barang}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formJumlah">
                  <Form.Label>Jumlah</Form.Label>
                  <div className="input-group">
                    <Button
                      variant="outline-secondary"
                      type="button"
                      onClick={() => handleDecrement('jumlah')}
                    >
                      -
                    </Button>
                    <Form.Control
                      type="number"
                      name="jumlah"
                      value={formData.jumlah}
                      onChange={handleChange}
                      required
                      className="text-center"
                    />
                    <Button
                      variant="outline-secondary"
                      type="button"
                      onClick={() => handleIncrement('jumlah')}
                    >
                      +
                    </Button>
                  </div>
                </Form.Group>

                <Form.Group controlId="formHargaSatuan">
                  <Form.Label>Harga Satuan</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="harga_satuan"
                    value={formData.harga_satuan}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formLokasi">
                  <Form.Label>Lokasi</Form.Label>
                  <Form.Control
                    as="select"
                    name="lokasi"
                    value={formData.lokasi}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Pilih Lokasi</option>
                    <option value="Bandung">Bandung</option>
                    <option value="Jakarta">Jakarta</option>
                    <option value="Denpasar">Denpasar</option>
                    <option value="Manokwari">Manokwari</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="formDeskripsi">
                  <Form.Label>Deskripsi</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-3">
                  Update Item
                </Button>
              </Form>

              <Link to="/">
                <Button variant="secondary" className="w-100 mt-3">
                  Back to Inventory
                </Button>
              </Link>
            </div>
          </div>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Item updated successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default UpdateItem;
