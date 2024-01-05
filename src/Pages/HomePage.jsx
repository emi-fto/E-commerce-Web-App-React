import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Search from "../Components/Search";

let API_URL = "http://localhost:5005";

function HomePage() {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('')
    const [timeoutId, setTimeoutId] = useState()

    const getAllItems = (query) => {
      if (query) {
        API_URL += `/items/search?q=${query}`
      }
      axios
          .get(`${API_URL}/items`)
          .then((response) => setItems(response.data))
          .catch((error) => console.error(error));
      };

    useEffect(() => {
        getAllItems();
    }, [] );  

    useEffect(() => {
      clearTimeout(timeoutId)
      if (searchTerm) {
        setTimeoutId(
          setTimeout(() => {
            getAllItems(searchTerm)
          }, 500)
        )
      }
    }, [searchTerm])

    return (
      <>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        <div className="ItemsList">
             {items.map((item) => {
          return (
            <div className="Item card" key={item.id} >
              <Link to={"/item/" + item.id}>
                <h3>{item.name}</h3>
                <img src={item.picture} alt="item picture"/> 
                <p>{item.description}</p>
                <p>{item.price}€</p>
              </Link>
            </div>
            );
            })} 
        </div>
      </>
    )
}

export default HomePage;