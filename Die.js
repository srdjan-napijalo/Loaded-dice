import "./index.css";
import one from "./dice/1.png";
import two from "./dice/2.png";
import three from "./dice/3.png";
import four from "./dice/4.png";
import five from "./dice/5.png";
import six from "./dice/6.png";

const Die = (props) =>{
    
    const getDiePng = (value) => {
        switch(value){
            case 1: return one;
            case 2: return two;
            case 3: return three;
            case 4: return four;
            case 5: return five;
            case 6: return six;
            default: return one;
        }
    } 

    const styles = {
        borderColor: props.isHeld ? "#5035ff" : "white"  }                                

    return(
        <div  style={styles} 
        className = {`${props.className} die`}
        onClick = {props.holdDice}>
                <img  src = {getDiePng(props.value)} width= "95%" alt="die"/>
        </div>)    
}
export default Die;