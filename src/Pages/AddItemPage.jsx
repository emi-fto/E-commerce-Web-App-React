import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { notifications } from "@mantine/notifications";
import { TextInput, Button, Group, Box, NumberInput } from "@mantine/core";

function AddItemPage({ VITE_API_URL }) {
  const navigate = useNavigate();
  // State variables to store the values of the form inputs.
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);

  // Handler functions for the form inputs. You can leave these as they are.
  const handleName = (event) => setName(event.target.value);
  const handleDescription = (event) => setDescription(event.target.value);
  const handlePicture = (event) => setPicture(event.target.value);
  const handleCategory = (event) => setCategory(event.target.value);
  const handlePrice = (event) => setPrice(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post(
        `${VITE_API_URL}`,
        {
          id: uuidv4(),
          name,
          description,
          picture,
          category,
          price: parseInt(price),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      notifications.show({
        title: `Item added correctly!`,
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="formCtn">
        <Box maw={340} mx="auto">
          <form onSubmit={handleSubmit}>
            <TextInput
              label="Name"
              placeholder="Item Name"
              value={name}
              onChange={handleName}
            />
            <TextInput
              mt="md"
              label="Description"
              placeholder="Description"
              value={description}
              onChange={handleDescription}
            />
            <TextInput
              mt="md"
              label="Image"
              placeholder="Picture URL"
              value={picture}
              onChange={handlePicture}
            />
            <TextInput
              mt="md"
              label="Category"
              placeholder="Category"
              value={category}
              onChange={handleCategory}
            />
            <TextInput
              label="Price"
              placeholder="Price in Euro"
              value={price}
              onChange={handlePrice}
            />

            <Group justify="center" mt="xl">
              <Button type="submit" mt="sm">
                Add Item
              </Button>
            </Group>
          </form>
        </Box>
      </div>
    </>
  );
}

export default AddItemPage;
