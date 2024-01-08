import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Search from "../Components/Search";
import { Card, Image, Text, Button, Group } from '@mantine/core';
import { SimpleGrid } from '@mantine/core';
import { notifications } from '@mantine/notifications';

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
        <SimpleGrid cols={3}>
          {items.map((item) => {
            return (
              <div className="Item card" key={item.id}>
  
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                      <Link to={"/item/" + item.id}>
                        <Card.Section>
                          <Image
                            src={item.picture}
                            height={160}
                            alt="Item picture"
                          />
                        </Card.Section>

                        <Group justify="space-between" mt="md" mb="xs">
                          <Text fw={500}>{item.name}</Text>
                        </Group>
                        <Text size="sm" c="dimmed">
                          {item.description}
                        </Text>
                        <Text size="sm" c="dimmed">
                          {item.price}€
                        </Text>
                        </Link>
                        
      
    
                        <Button color="blue" fullWidth mt="md" radius="md" onClick={() => {
                          notifications.show({
                            title: 'Item added to the cart!'
                          });
                          addToCart(item)}}
                          >
                        Add to Cart
                        </Button>
                        

                        <Button color="blue" fullWidth mt="md" radius="md" onClick={() => deleteItem(item.id)}>
                        Delete item
                        </Button>
                        <Link to={"/edit/" + item.id}>
                          <Button color="blue" fullWidth mt="md" radius="md">
                          Update item
                          </Button>
                        </Link>
                    </Card> 
              </div>
            );
          })}
          </SimpleGrid>
          </div>
    </>
  );
}
export default HomePage;
