import express, {Router, Request, Response, NextFunction} from 'express';
const router: Router = express.Router();
import fs from 'fs';
import path from "path"
import axios from 'axios'
import { json } from 'stream/consumers';


interface moviesInterface {
title: string,
description : string,
image: string,
price: number,
id: string
}

let moviesDatabase: moviesInterface [] = [];

let allMovies = JSON.parse(fs.readFileSync(path.resolve("./databases/movies.json"),"utf-8"));

router.get('/', function(req: Request, res: Response, next:NextFunction) {
  
  let allMovies = JSON.parse(fs.readFileSync(path.resolve("./databases/movies.json"), "utf-8"));
  res.status(200).render("homepage", {allMovies})
  console.log(allMovies)
});

router.post('/', function(req: Request, res: Response) {
  const movieId = allMovies[allMovies.length-1].id + 1
  const newMovie = Object.assign(req.body,{id: movieId});
  allMovies.push(newMovie)

  fs.writeFile(path.resolve("./databases/movies.json"),JSON.stringify(allMovies, null, 2), err => {
    res.status(201).json
       newMovie
  })
  res.status(200).render("added") 
});


router.put('/:title', function(req: Request, res: Response, next:NextFunction) {
  let myMovies:any = allMovies.find((x:any) => x.title === req.params.title);
  if (!myMovies) return res.status(404).send('The movie does not exist')
  else{
    let movieIndex:number = allMovies.indexOf(myMovies)
    myMovies = {...myMovies, ...req.body}
    allMovies[movieIndex]= myMovies

    fs.writeFile(path.resolve("./databases/movies.json"),JSON.stringify(allMovies, null, 2), err => {
      res.status(201).json({
        movie:myMovies
      })
    })
  }
});

router.get('/:title', function(req: Request, res: Response, next:NextFunction) {
  
  let myMovies:any = allMovies.find((x:any) => x.title === req.params.title.slice(5));
  console.log(myMovies,req.params)
  if (!myMovies) return res.status(404).send('The movie does not exist')
  else{
    let movieIndex:number = allMovies.indexOf(myMovies) 
   allMovies.splice(movieIndex,1)
  

    fs.writeFile(path.resolve("./databases/movies.json"),JSON.stringify(allMovies, null, 2), err => {
      res.status(201).render('deleted')
    })
  }
  console.log(req.params)  
});

export default router;

