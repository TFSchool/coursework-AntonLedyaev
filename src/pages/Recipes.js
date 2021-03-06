import React from 'react';
import Header from "../components/Header";
import PostList from "../components/PostList";
import {useState,useEffect} from "react";
import {child, get, getDatabase, ref} from "firebase/database";
import {useDispatch} from "react-redux";
const Recipes = () => {
  const dispatch = useDispatch();
  const [recipeList, setRecipeList] = useState([]);
  const db = getDatabase();
  useEffect(() => {
    function getData() {
      get(child(ref(db), `/recipes/`)).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setRecipeList(Object.values(data));
          dispatch({type: "SET_RECIPES", payload: Object.values(data) })
        }
      })
    }
    getData()
  }, [])

  return (
    <div>
      <Header/>
      <div className="container">
        <PostList posts = {recipeList}/>
      </div>
    </div>
  );
};

export default Recipes;