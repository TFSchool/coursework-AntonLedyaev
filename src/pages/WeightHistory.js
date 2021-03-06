import React, {useEffect, useState} from 'react';
import Header from "../components/Header";
import styles from "../styles/WeightHistory.module.css"
import Button from "../decorators/Button";
import Graphic from "../components/Graphic";
import HistoryTable from "../components/HistoryTable";
import Input from "../decorators/Input";
import {useDispatch, useSelector} from "react-redux";
import firebase from 'firebase/compat/app';
import 'firebase/database';
import { getDatabase, ref, child, get, set, update } from "firebase/database";
import {setData} from "../utils/setData";
import {userName} from "../utils/userName";


const WeightHistory = (props) => {
  const dispatch = useDispatch();
  const weightState = useSelector(state => state.weight)
  const [wantedWeight, setWantedWeight] = useState(0);
  const [currentWeight, setCurrentWeight] = useState({id: Date.now(),value: 0})

  const state = useSelector(state => state)
  const db = getDatabase();

  useEffect(() => {
    const updates = {}
    updates[`/users/${userName(state)}/weight/weightHistory`] = state.weight.weight.weightHistory
    if(state.weight.weight.weightHistory.length !== 0) {
      update(ref(db), updates).then();
    }
    updates[`/users/${userName(state)}/weight/initialWeight`] = state.weight.weight.initialWeight
    if(state.weight.weight.initialWeight !== 0) {
      update(ref(db), updates).then();
    }
    updates[`/users/${userName(state)}/weight/wantedWeight`] = state.weight.weight.wantedWeight
    if(state.weight.weight.wantedWeight !== 0) {
      update(ref(db), updates).then();
    }


  }, [state.weight, state.user.user])
  useEffect(() => {
    function getData() {
      get(child(ref(db), `/users/${userName(state)}/weight`)).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val()
          if(!data.weightHistory) {
            data.weightHistory = []
          }
          dispatch({type: "GET_WEIGHT", payload: data})
        }
      })
    }
    if (state.user.user !== ''){
      getData()
    }

  },[dispatch, state.user.user])



  const handleCurrentWeightChange = (event) => {
    event.preventDefault();
    const newWeight = {
      ...currentWeight, id: Date.now()
    }
    dispatch({type: "ADD_WEIGHT", payload: newWeight})
  }

  const handleWantedWeightChange = (event) => {
    event.preventDefault();
    dispatch({type: "CHANGE_WANTED_WEIGHT", payload: wantedWeight})
  }

  const handleInitialWeightChange = (event) => {
    event.preventDefault();
    dispatch({type: "CHANGE_INITIAL_WEIGHT", payload: wantedWeight})
  }

  const handleWeightRemove = (index) => {
    dispatch({type: "DELETE_WEIGHT", payload: index})

  }

  return (
    <div>
      <Header/>
      <div className={"container"}>
        <div className={styles.WeightHistoryContainer}>
          <h2>???????????????????? </h2>
          <Input
            className={styles.WeightHistoryInput}
            type="number"
            placeholder={"?????????????? ?????? ??????"}
            onChange={e=> setCurrentWeight({id: Date.now(), value: e.target.value})}/>
          <Button onClick = {handleCurrentWeightChange}>
            ??????????????????
          </Button>
        </div>
        <div className={styles.WeightHistoryContainer}>
          <h2>???????????? ??????????????????</h2>
          <Graphic weightHistory = {weightState.weight.weightHistory || []}/>
        </div>
        <div className={styles.WeightHistoryContainer}>
          <h2>?????????????? ?????????????????? ????????</h2>
          <HistoryTable
            wantedWeight ={weightState.weight.wantedWeight}
            currentWeight = {currentWeight.value}
            weightHistory = {weightState.weight.weightHistory || []}
            removeWeight = {handleWeightRemove}
            initialWeight = {weightState.weight.initialWeight}
          />
        </div>

        <div className={styles.WeightHistoryContainer}>
          <h2>???????????????? ???????????????? ?????? </h2>
          <Input
            className={styles.WeightHistoryInput}
            onChange ={e=>setWantedWeight(e.target.value)}
            type="text"
            placeholder={"?????????????? ???????????????? ??????"}/>
          <Button onClick = {handleWantedWeightChange}>
            ??????????????????
          </Button>
        </div>
        <div className={styles.WeightHistoryContainer}>
          <h2>???????????????? ?????????????????? ?????? </h2>
          <Input
            className={styles.WeightHistoryInput}
            onChange ={e=>setWantedWeight(e.target.value)}
            type="text"
            placeholder={"?????????????? ?????????????????? ??????"}/>
          <Button onClick = {handleInitialWeightChange}>
            ??????????????????
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WeightHistory;