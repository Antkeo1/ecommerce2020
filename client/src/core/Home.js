import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { getProducts } from "./apiCore";
import Card from "./Card";
import Search from "./Search";

const Home = () => {
  const [productsBySell, setProductsBySell] = useState([]);
  const [productsByArrival, setProductsByArrival] = useState([]);
  const [error, setError] = useState(false);
  const [runHome, setRunhome] = useState(false);

  // show products that have been sold
  const loadProductsBySell = () => {
    getProducts("sold").then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProductsBySell(data);
      }
    });
  };

  // show products that are newly created
  const loadProductsByArrival = () => {
    getProducts("createdAt").then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProductsByArrival(data);
      }
    });
  };

  //const loadMore = () => {
  //  getProducts("createdAt").then((data) => {
  //    if (data.error) {
  //      setError(data.error);
  //    } else {
  //      setProductsByArrival(data);
  //      setSize(data.size);
  //      setSkip(0);
  //    }
  //  });
  //};

  useEffect(() => {
    loadProductsByArrival(productsByArrival);
    loadProductsBySell();
  }, [runHome]);

  return (
    <Layout
      title="Home Page"
      description="E-commerce App"
      className="container-fluid"
    >
      <Search />
      <h2 className="mb-4">New Arrivals</h2>
      <div className="row" id="homeCards">
        {productsByArrival.map((product, i) => (
          <div key={i} className="col-4 mb-3">
            <Card
              id="card"
              product={product}
              setRunhome={setRunhome}
              runHome={runHome}
            />
          </div>
        ))}
      </div>

      <h2 className="mb-4">Best Sellers</h2>
      <div className="row" id="homeCards">
        {productsBySell.map((product, i) => (
          <div key={i} className="col-4 mb-3">
            <Card
              id="card"
              product={product}
              setRunhome={setRunhome}
              runHome={runHome}
            />
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Home;
