import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Search from "../Components/Search";

function HomePage({cartItems, setCartItems}) {

  let API_URL = "http://localhost:5005/items";
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeoutId, setTimeoutId] = useState();
  

  const getAllItems = (query) => {
    if (query) {
      API_URL += `?q=${query}`;
    }
    axios
      .get(`${API_URL}`)
      .then((response) => setItems(response.data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getAllItems();
  }, []);
  useEffect(() => {
    clearTimeout(timeoutId);
    if (searchTerm) {
      setTimeoutId(
        setTimeout(() => {
          getAllItems(searchTerm);
        }, 300)
      );
    } else {
      getAllItems();
    }
  }, [searchTerm]);

  const addToCart = (item) => {
      setCartItems([...cartItems, item]);
      window.alert('Item added to the cart!')
  };

  const deleteItem = (itemId) => { 
    const confirmDelete = window.confirm("Are you sure you have the permission to delete this item?");
    if (confirmDelete) {
      axios
        .delete(`${API_URL}/${itemId}`)
        .then(() => {
          getAllItems()
        })
        .catch((err) => {
          console.error("Error deleting item:", err);
        });
    }
  };
  
  return (
    <>
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="ItemsList">
        {items.map((item) => {
          return (
            <div className="Item card" key={item.id}>
              <Link to={"/item/" + item.id}>
                <h3>{item.name}</h3>
                <img src={item.picture} alt="item picture" />
                <p>{item.description}</p>
                <p>{item.price}€</p>
              </Link>
              <button onClick={() => addToCart(item)}>Add to Cart</button>
              <button onClick={() => deleteItem(item.id)}>Delete item</button>
              <Link to={"/edit/" + item.id}>
              <button>Update item</button>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
export default HomePage;
