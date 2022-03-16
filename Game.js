import {useState, useEffect} from 'react';
import Die from "./Die";
import "./index.css";
import Confetti from 'react-confetti';
import shakeSound from './dice/shake.mp3';
const Game = () => {

    const [currentPlayer, setCurrentPlayer] = useState(1);
    const [player1points, setPlayer1] = useState(0);
    const [player2points, setPlayer2] = useState(0);
    const [player1counter, setCounter1] = useState(0);
    const [player2counter, setCounter2] = useState(0);
    const [winner, setWinner] = useState(false);   
    const [shake, setShake] = useState(false); 

    const allNewDice =  () => {
      const newDice = [];
      for (var i = 0; i < 10; i++)
        newDice.push({
          key: i,
          value: Math.ceil(Math.random() * 6),
          isHeld: false
        });
      return newDice;
    }

    const [dice, setDice]  = useState(allNewDice());

    const holdDice = (id) =>{ 
      setDice(oldDice =>  oldDice.map(die => { 
        return  die.key === id ? 
        {...die, isHeld: !die.isHeld } :
        die
      }))} 

    const diceElements = dice.map(die=> (
       <Die holdDice = {() => holdDice(die.key)}
            className = {shake && !die.isHeld? "shake": ""}
            key={die.key} value ={die.value} 
            isHeld={die.isHeld}/>))

    const changePlayer = () => {
    setCurrentPlayer(player => {
      if(player === 1) return 2; 
      else return 1;
        })
    }
  
    useEffect(() => {

      if(player1points === 3 || player2points === 3)  
      setWinner(true);        
      
      if(!dice.every(die => die.isHeld)) return;  //if all dice are not held then return
         
       for(var i=0; i<9; i++)
            if(dice[i].value !== dice[i+1].value) return;  //if all dice values are not the same then return
        
        //run next two lines after both players complete round 
        setDice(allNewDice());
        changePlayer();

        if(currentPlayer===2){ //run this only after second player complete round
        
          if(player1counter < player2counter)
          setPlayer1(score =>{return score+1})
    
          if(player1counter > player2counter)
          setPlayer2(score =>{return score+1}); 
                
          setCounter1(0);
          setCounter2(0);     
      }

  }, [dice, player1counter, player2counter, player1points, player2points, currentPlayer]);

  const shakeDice = () =>{ // sound and animation
    var audio = new Audio(shakeSound);
    audio.play();
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }


  const rollDice = () => { // this is button onClick handler
      if(!winner){  //if we dont have winner button should roll unheld dice
  
          shakeDice();
        
         if(dice.some((die) => die.isHeld)) // if some dice is held  
            currentPlayer===1 ?  //increment counter for current player
            setCounter1(prev => {return prev+1}):  
            setCounter2(prev => {return prev+1});

            setDice(oldDice => oldDice.map(die => {            
                  return die.isHeld ? die : //if held return same die 
                  {...die, value:  Math.ceil(Math.random() * 6)}
                  })); // if not then new one with random value                 
        }
      else { // if we have winner, button would restart game
        alert("Player "+ ((player1points>player2points)? "1" : "2" ) 
              +" has  won! \n 'Dice was loaded from the start!'");
        setWinner(false);
        setPlayer1(0);
        setPlayer2(0);
      }      
    }
   
  return (
    <main>
        {winner && <Confetti/>}
        <h1 className="title">Loaded dice</h1>        
        <p className="instructions">
          1. Roll untill all dice are the same.  <br/>  2. Click each die to freeze it at its current value between rolls. <br/>
          3. Roll less than your opponent. <br/> 4. You have free rolls before you hold first di(c)e. <br/> 5. Take 3 points and win! GL!</p>

        <table className="scoreboard"> 
              <thead><tr><td></td><td>Wins</td><td>Rolls</td></tr></thead>
              <tbody><tr><td>Player 1</td><td>{player1points}</td><td>{player1counter}</td></tr>
              <tr><td>Player 2</td><td>{player2points}</td><td>{player2counter}</td></tr>
              <tr><td colSpan="3" className="purple">Player {currentPlayer} on roll!</td></tr></tbody>
        </table>
        <div className=  "dice-container"> {diceElements} </div>
        <button className =  "roll-btn"  onClick={rollDice}>  {winner? "Restart" : "Roll"}</button>
    </main>
  );
}
export default Game;