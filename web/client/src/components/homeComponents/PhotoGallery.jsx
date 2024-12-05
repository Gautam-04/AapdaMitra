import Carousel from "react-bootstrap/Carousel";
import french from "../../assets/French.jpg";
import mount1 from "../../assets/Mountaineering.jpg";
import mount2 from "../../assets/Mountaineering2.jpg";
import still1 from "../../assets/Still1.jpg";
import "./Photo.css";
function PhotoGallery() {
  const slides = [french, mount1, mount2, still1];

  return (
    <div className="photo-gallery" id="gallery">
      <div className="gallery-header">
        <h2>Photo Gallery</h2>
      </div>
      <Carousel>
        {slides.map((slide, index) => (
          <Carousel.Item key={index}>
            <div>
              <img src={slide} alt={slide.alt} />
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

export default PhotoGallery;
