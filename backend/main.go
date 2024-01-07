package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

func main() {
	InitDB()
	defer DB.Close()
	log.Println("Server Running on Port 8081")

	// Router
	router := mux.NewRouter()
	router.HandleFunc("/inventory_dellaputrw", GetInventoryItems).Methods("GET")
	router.HandleFunc("/inventory_dellaputrw", CreateInventoryItem).Methods("POST")
	router.HandleFunc("/inventory_dellaputrw/{id}", GetInventoryItem).Methods("GET")
	router.HandleFunc("/inventory_dellaputrw/{id}", UpdateInventoryItem).Methods("PUT")
	router.HandleFunc("/inventory_dellaputrw/{id}", DeleteInventoryItem).Methods("DELETE")
	router.HandleFunc("/inventory_dellaputrw/search", SearchInventoryByName).Methods("GET")

	// Add CORS middleware
	handler := &CORSRouterDecorator{router}

	// Start server with error handling
	err := http.ListenAndServe(":8081", handler)
	if err != nil {
		log.Fatal(err)
	}
}

// =================================================================
// QUERY IN CRUD

// GET ALL INVENTORY
func GetInventoryItems(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var inventoryItems []InventoryItem

	result, err := DB.Query("SELECT id, nama_barang, jumlah, harga_satuan, lokasi, deskripsi FROM inventory_dellap")
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	for result.Next() {
		var inventoryItem InventoryItem
		err := result.Scan(&inventoryItem.ID, &inventoryItem.NamaBarang,
			&inventoryItem.Jumlah, &inventoryItem.HargaSatuan, &inventoryItem.Lokasi, &inventoryItem.Deskripsi)
		if err != nil {
			panic(err.Error())
		}
		inventoryItems = append(inventoryItems, inventoryItem)
	}
	json.NewEncoder(w).Encode(inventoryItems)
}

// CREATE NEW INVENTORY
func CreateInventoryItem(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	stmt, err := DB.Prepare("INSERT INTO inventory_dellap(nama_barang, jumlah, harga_satuan, lokasi, deskripsi) VALUES(?,?,?,?,?)")
	if err != nil {
		panic(err.Error())
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err.Error())
	}
	defer r.Body.Close()

	var inventoryItem InventoryItem
	err = json.Unmarshal(body, &inventoryItem)
	if err != nil {
		panic(err.Error())
	}

	_, err = stmt.Exec(inventoryItem.NamaBarang, inventoryItem.Jumlah, inventoryItem.HargaSatuan, inventoryItem.Lokasi, inventoryItem.Deskripsi)
	if err != nil {
		panic(err.Error())
	}

	fmt.Fprintf(w, "New inventory item was created")
}

// GET INVENTORY BY ID
func GetInventoryItem(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	result, err := DB.Query("SELECT id, nama_barang, jumlah, harga_satuan, lokasi, deskripsi FROM inventory_dellap WHERE id = ?", params["id"])
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	var inventoryItem InventoryItem
	for result.Next() {
		err := result.Scan(&inventoryItem.ID, &inventoryItem.NamaBarang,
			&inventoryItem.Jumlah, &inventoryItem.HargaSatuan, &inventoryItem.Lokasi, &inventoryItem.Deskripsi)
		if err != nil {
			panic(err.Error())
		}
	}
	json.NewEncoder(w).Encode(inventoryItem)
}

// UPDATE INVENTORY
func UpdateInventoryItem(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	stmt, err := DB.Prepare("UPDATE inventory_dellap SET nama_barang = ?," +
		"jumlah = ?, harga_satuan=?, lokasi=?, deskripsi=? WHERE id = ?")

	if err != nil {
		panic(err.Error())
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err.Error())
	}
	keyVal := make(map[string]string)
	json.Unmarshal(body, &keyVal)
	nama_barang := keyVal["nama_barang"]
	jumlah := keyVal["jumlah"]
	harga_satuan := keyVal["harga_satuan"]
	lokasi := keyVal["lokasi"]
	deskripsi := keyVal["deskripsi"]
	_, err = stmt.Exec(nama_barang, jumlah, harga_satuan, lokasi, deskripsi, params["id"])
	if err != nil {
		panic(err.Error())
	}
	fmt.Fprintf(w, "Inventory item with ID = %s was updated",
		params["id"])
}

// DELETE INVENTORY
func DeleteInventoryItem(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)

	stmt, err := DB.Prepare("DELETE FROM inventory_dellap WHERE id = ?")
	if err != nil {
		panic(err.Error())
	}
	_, err = stmt.Exec(params["id"])
	if err != nil {
		panic(err.Error())
	}
	fmt.Fprintf(w, "Inventory item with ID = %s was deleted",
		params["id"])
}

// SEARCH INVENTORY BY NAME
func SearchInventoryByName(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Extract search term from URL query parameter
	params := r.URL.Query()
	searchTerm := params.Get("name")

	// Log to check the value of searchTerm
	log.Println("Search term:", searchTerm)

	// Check if the search term is empty
	if searchTerm == "" {
		http.Error(w, "Missing search term", http.StatusBadRequest)
		return
	}

	// Query the database to retrieve items by name using LIKE
	result, err := DB.Query("SELECT id, nama_barang, jumlah, harga_satuan, lokasi, deskripsi FROM inventory_dellap WHERE nama_barang LIKE ?", "%"+searchTerm+"%")
	if err != nil {
		// Log the error for debugging purposes
		log.Println("Error executing SQL query:", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer result.Close()

	var inventoryItems []InventoryItem

	// Iterate through the result set
	for result.Next() {
		var inventoryItem InventoryItem
		err := result.Scan(&inventoryItem.ID, &inventoryItem.NamaBarang, &inventoryItem.Jumlah, &inventoryItem.HargaSatuan, &inventoryItem.Lokasi, &inventoryItem.Deskripsi)
		if err != nil {
			// Log the error for debugging purposes
			log.Println("Error scanning result row:", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		inventoryItems = append(inventoryItems, inventoryItem)
	}

	// Log to check the result
	log.Println("Found items:", inventoryItems)

	// Mengembalikan data dalam format JSON
	json.NewEncoder(w).Encode(inventoryItems)
}

// =================================================================

type InventoryItem struct {
	ID          int     `json:"id"`
	NamaBarang  string  `json:"nama_barang"`
	Jumlah      int     `json:"jumlah"`
	HargaSatuan float64 `json:"harga_satuan"`
	Lokasi      string  `json:"lokasi"`
	Deskripsi   string  `json:"deskripsi"`
}

// =================================================================
// Melakukan Koneksi dengan Database

var DB *sql.DB
var err error

func InitDB() {
	DB, err = sql.Open("mysql", "root:@/db_2204959_dellaputri_uas")
	if err != nil {
		panic(err)
	}

	log.Println("Database Connected")
}

// =================================================================
// Melakukan Koneksi dengan Frontend

type CORSRouterDecorator struct {
	R *mux.Router
}

func (c *CORSRouterDecorator) ServeHTTP(rw http.ResponseWriter,
	req *http.Request) {
	if origin := req.Header.Get("Origin"); origin != "" {
		rw.Header().Set("Access-Control-Allow-Origin", origin)
		rw.Header().Set("Access-Control-Allow-Methods",
			"POST, GET, OPTIONS, PUT, DELETE")
		rw.Header().Set("Access-Control-Allow-Headers",
			"Accept, Accept-Language,"+
				" Content-Type, YourOwnHeader")
	}
	if req.Method == "OPTIONS" {
		return
	}

	c.R.ServeHTTP(rw, req)
}
