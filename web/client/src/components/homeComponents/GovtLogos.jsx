import Amrit from "../../assets/Amrit_Mahotsav_0-removebg-preview 1.svg"
import G20 from "../../assets/G20- 1.svg"
import Police from "../../assets/Police_aur_Seva 1.svg"
import PMNRF from "../../assets/pmnrf 1.svg"
import MyGov from "../../assets/mygov 1.svg"
import Incred from "../../assets/incredible-india 1.svg"
import Gov from "../../assets/india-gov 1.svg"
import "./Style.css"
const governmentLogos = [
  G20,
  Police ,
  Amrit,
  PMNRF,
  Incred,
  MyGov,
  Gov
];

const GovtLogos = () => {
  return (
    <div className="government-logos">
      {governmentLogos.map((logo, index) => (
        <img src={logo} alt="images" key={index}/>
      ))}
    </div>
  );
};

export default GovtLogos;