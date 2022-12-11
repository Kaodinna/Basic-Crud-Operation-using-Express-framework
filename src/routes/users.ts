import express, {Router, Request, Response, NextFunction} from 'express';
const router: Router = express.Router();
import fs from 'fs';
import path from "path"
const Joi = require('joi');


interface userInterface {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

let userDatabase: userInterface [] = []

let allUsers = JSON.parse(fs.readFileSync(path.resolve("./databases/users.json"), "utf-8"));






/* GET users listing. */
router.get('/', function(req: Request, res:Response, next: NextFunction) {
  
  res.status(202).json({allUsers});
});

router.get('/register', function (req:Request, res:Response, next:NextFunction){
  res.status(202).render('register');
})

router.get('/login', function (req:Request, res:Response, next:NextFunction){
  res.status(202).render('login');
})
router.post('/login', (req:Request, res:Response,) => {
  let {email, password} = req.body;
  console.log(req.body)
  
  const user = allUsers.find((user: {password: string; email: string}) => user.email ===email && user.password === password)
  console.log(user)

  if(!user) {
  res.render('register')
    return 
  }

  res.render('dashboard')
})

router.get('/dashboard', function (req:Request, res:Response, next:NextFunction){
  res.status(202).render('dashboard');
})


router.get('/addmovie', function (req:Request, res:Response, next:NextFunction){
  res.status(202).render('addmovie');
})


router.get('/deletemovie', function (req:Request, res:Response, next:NextFunction){
 const allMovies = JSON.parse(fs.readFileSync(path.resolve('./databases/movies.json'), 'utf-8'));
  res.status(202).render('allmovies', {allMovies});
})

const registerSchema = Joi.object({
  fullname: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  username: Joi.string().min(5).required(),
  password: Joi.string().min(5).max(10).required()
});



router.post('/register', function(req: Request, res: Response) {
  
  const result = registerSchema.validate(req.body, {abortEarly: false})

  if (result.error) {
    console.log(result.error)
    res.status(400).send(result.error.details[0].message);
    return;
  }
   else {
    const newUser = {
      fullname: req.body.fullname,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    }
  allUsers.push(newUser)
  fs.writeFile(path.resolve("./databases/users.json"),JSON.stringify(allUsers, null, 2), err => {
    res.status(201).json
  })
  res.render("login") 
};
});





export default router;
