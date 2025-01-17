import { RecipeService } from './../recipe.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '../../../../node_modules/@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '../../../../node_modules/@angular/forms';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
id:number
editMode = false
recipeForm:FormGroup
  constructor(private route:ActivatedRoute,
              private recipeService:RecipeService,
              private router:Router) { }
        ngOnInit() {
        this.route.params
        .subscribe(
        (param:Params) => {
        this.id = +param['id']
        this.editMode = param['id'] != null
        this.initForm();
      }
    )
  }

  onSubmit() {
    // const newRecipe = new Recipe(
    //   this.recipeForm.value['name'],
    //   this.recipeForm.value['description'],
    //   this.recipeForm.value['imagePath'],
    //   this.recipeForm.value['ingredients']
    // );
     if(this.editMode){
       this.recipeService.updateRecipe(this.id,this.recipeForm.value)
     }else {
       this.recipeService.addRecipe(this.recipeForm.value)
     }
     this.onCancel();
   }

   onCancel() {
    this.router.navigate(['../'], {relativeTo:this.route});
   }

   private initForm(){
  let recipeName = '';
  let recipeImagePath = '';
  let recipeDescription = '';
  let recipeIngredient = new FormArray([]);

  if(this.editMode){
  const recipe = this.recipeService.getRecipes(this.id);
  recipeName = recipe.name;
  recipeImagePath = recipe.imgPath;
  recipeDescription = recipe.description
  if(recipe['ingredients']) {
    for(let ingredient of recipe.ingredients) {
      recipeIngredient.push(
        new FormGroup({
          'name': new FormControl(ingredient.name,Validators.required),
          'amount': new FormControl(ingredient.amount,[ Validators.pattern(/^[1-9]+[0-9]*$/), Validators.required])
        })); }
  }
  }
    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName,Validators.required),
      'imagePath': new FormControl(recipeImagePath,Validators.required),
      'description': new FormControl(recipeDescription,Validators.required),
      'ingredients': recipeIngredient
    })
   }

   onAddIngredients() {
     (<FormArray>this.recipeForm.get('ingredients')).push(
       new FormGroup({
         'name': new FormControl(null,Validators.required),
         'amount':new FormControl(null,[ Validators.required,Validators.pattern(/^[1-9]+[0-9]*$/)])
       })
     )
   }

   onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
   }
}
