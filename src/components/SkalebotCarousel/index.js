import { Carousel } from "primereact/carousel";
import "./index.css";
import { Text } from "../Text";

const SkalebotCarousel = ({ carouselItems }) => {
  
  const itemTemplate = (item) => {
    return (
      <div className="product-item">
        <div className="product-item-content car-item">
          <div className="carousel-img-continer">
            <img
              src={`${item}`}
              onError={(e) => (e.target.src = "./images/ImgPlaceholder.svg")}
              alt={"item.name"}
              className="product-image"
              style={{ maxWidth: "100%", borderRadius: "4px" }}
            />
          </div>
          {/* <div className="text-center pt-1">
          <Text type={"sub-heading"}>{item.productName}</Text>
        </div> */}
        </div>
      </div>
    );
  };

  if (carouselItems.length <= 0) {
    return (
      <div className="carousel-img-continer">
        <img src={`./images/ImgPlaceholder.svg`} style={{ maxWidth: "100%", borderRadius: "4px" }} />
      </div>
    );
  } else if (carouselItems.length == 1) {
    return (
      <div className="car-item">
        <div className="carousel-img-continer">
          <img
            src={`${carouselItems[0].url}`}
            onError={(e) => (e.target.src = "./images/ImgPlaceholder.svg")}
            className="product-image"
            style={{ maxWidth: "100%", borderRadius: "4px" }}
          />
        </div>
        {/* <div className="text-center pt-1">
          <Text type={"sub-heading"}>{carouselItems[0].productName}</Text>
        </div> */}
      </div>
    );
  }

  return (
    <div className={`carousel-container`}>
      <Carousel
        value={carouselItems}
        itemTemplate={itemTemplate}
        className="skalebot-carousel"
      />
    </div>
  );
};

export default SkalebotCarousel;
