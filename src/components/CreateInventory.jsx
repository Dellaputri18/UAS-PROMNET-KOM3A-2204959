import React, { useState } from 'react';
import { Container, Form, Button, Alert, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import InventoryService from '../services/InventoryService';

function CreateInventory() {
  const [formData, setFormData] = useState({
    nama_barang: '',
    jumlah: 0,
    harga_satuan: '',
    lokasi: '',
    deskripsi: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleIncrement = () => {
    setFormData((prevData) => ({ ...prevData, jumlah: prevData.jumlah + 1 }));
  };

  const handleDecrement = () => {
    if (formData.jumlah > 0) {
      setFormData((prevData) => ({ ...prevData, jumlah: prevData.jumlah - 1 }));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // You can add additional logic here if needed
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi jumlah
    const parsedJumlah = parseInt(formData.jumlah, 10);
    if (isNaN(parsedJumlah) || parsedJumlah < 0) {
      setErrorMessage('Jumlah harus lebih besar atau sama dengan 0.');
      return;
    }

    // Validasi harga satuan
    const parsedHargaSatuan = parseInt(formData.harga_satuan, 10);
    if (isNaN(parsedHargaSatuan) || parsedHargaSatuan < 0) {
      setErrorMessage('Harga satuan harus lebih besar atau sama dengan 0.');
      return;
    }

    try {
      console.log('Request Data:', formData);
      const response = await InventoryService.createItem({
        ...formData,
        jumlah: parsedJumlah,
        harga_satuan: parsedHargaSatuan,
      });
      console.log('Response Data:', response.data);

      console.log('Item created successfully');
      handleShowModal(); // Show modal on success

      // Bersihkan pesan kesalahan setelah berhasil membuat item
      setErrorMessage('');
    } catch (error) {
      console.error('Error creating item:', error.response || error);

      if (error.response) {
        // Handle specific error cases, if needed
        if (error.response.status === 400) {
          setErrorMessage('Bad request. Please check your data.');
        } else {
          setErrorMessage('Terjadi kesalahan saat membuat item. Silakan coba lagi.');
        }
      } else {
        setErrorMessage('Terjadi kesalahan saat membuat item. Silakan coba lagi.');
      }
    }
  };

  const handleModalConfirm = () => {
    handleCloseModal();
    navigate('/'); // Navigate to the home route
  };

  return (
    <Container className="vh-100 mt-5">
      <Row className="d-flex align-items-center justify-content-center">
        <Col md={5}>
          <div className="card">
            <div className="card-body rounded-2">
              <h2 className="text-center mb-4">Create Inventory's</h2>
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
                  <div className="d-flex">
                    <Button variant="outline-secondary" onClick={handleDecrement}>
                      -
                    </Button>
                    <Form.Control
                      type="number"
                      name="jumlah"
                      value={formData.jumlah}
                      onChange={handleChange}
                      required
                    />
                    <Button variant="outline-secondary" onClick={handleIncrement}>
                      +
                    </Button>
                  </div>
                  {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                </Form.Group>

                <Form.Group controlId="formHargaSatuan">
                  <Form.Label>Harga Satuan</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Masukkan Harga Satuan"
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
                  Create Item
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

      {/* Modal for Success */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Item created successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleModalConfirm}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default CreateInventory;
