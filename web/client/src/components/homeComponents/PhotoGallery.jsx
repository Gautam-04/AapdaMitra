import Carousel from "react-bootstrap/Carousel";
import french from "../../assets/French.jpg";
import mount1 from "../../assets/Mountaineering.jpg";
import mount2 from "../../assets/Mountaineering2.jpg";
import still1 from "../../assets/Still1.jpg";
import "./Photo.css"
function PhotoGallery() {
  const slides = [
    {
      src: french,
      alt: "French Delegation",
      label: "First Slide Label",
      description: "Nulla vitae elit libero, a pharetra augue mollis interdum.",
    },
    {
      src: mount1,
      alt: "Mountaineering 1",
      label: "Second Slide Label",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      src: mount2,
      alt: "Mountaineering 2",
      label: "Third Slide Label",
      description:
        "Praesent commodo cursus magna, vel scelerisque nisl consectetur.",
    },
    {
      src: still1,
      alt: "Still from Meeting",
      label: "Fourth Slide Label",
      description:
        "Praesent commodo cursus magna, vel scelerisque nisl consectetur.",
    },
  ];

  return (
    <div className="photo-gallery">
      <div className="gallery-header">
        <h2>Photo Gallery</h2>
      </div>
      <Carousel>
        {slides.map((slide, index) => (
          <Carousel.Item key={index}>
            <div>
              <img src={slide.src} alt={slide.alt} />
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

export default PhotoGallery;
