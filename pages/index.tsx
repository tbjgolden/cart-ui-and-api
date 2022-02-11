import Layout from "components/Layout";

export default () => {
  return (
    <Layout>
      <div
        className="section"
        style={{
          backgroundImage: `url("/0.png")`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          justifyContent: "center",
        }}
      >
        <div className="jumbotron-text-container">
          <p>APPS unveils new studio Lagom</p>
          <h1>Lagom</h1>
        </div>
      </div>
      <div
        className="section"
        style={{
          justifyContent: "center",
        }}
      >
        <div className="centered-text-container">
          <h1>Innovation and experience design agency. </h1>
          <p>Apps is an innovation and experience design agency.</p>
          <p>We exist to create a better future with you.</p>
          <button>Products</button>
        </div>
      </div>
      <div className="split-container">
        <div
          className="image-container"
          style={{
            backgroundImage: `url("/1.png")`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            justifyContent: "center",
          }}
        />
        <div className="text-half">
          <div className="text-container">
            <h1>The imaginative application of art and science.</h1>
            <p>
              We architect, design and deliver iconic experiences, services and
              products that improve people's lives.
            </p>
            <button>Read Latest</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
