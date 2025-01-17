
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '../../../../node_modules/@angular/forms';
import { Subscription } from '../../../../node_modules/rxjs';


@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy{
  @ViewChild('f') slForm:NgForm;
  subscription:Subscription
  editMode = false;
  editedItemIndex:number
  editedItem:Ingredient;

  constructor(private slService:ShoppingListService) { }

  ngOnInit() {
  this.subscription = this.slService.startedEditing
  .subscribe(
     (index:number) => {
       this.editedItemIndex = index
       this.editMode = true;
       this.editedItem = this.slService.getIngredient(index);
       this.slForm.setValue({
         name:this.editedItem.name,
         amount:this.editedItem.amount
       });
     }
  );
  }
  ngOnDestroy(){
  this.subscription.unsubscribe()
  }
  onSubmit(form:NgForm){
  const value = form.value;
  const newIngredient = new Ingredient(value.name , value.amount);
  if(this.editMode){
    this.slService.updateIngredient(this.editedItemIndex,newIngredient)
  } else {
    this.slService.addIngredients(newIngredient)
  }
  form.reset();
  this.editMode = false;
  }

  onReset() {
    this.editMode = false;
    this.slForm.reset();
  }
  onDelete(){
    this.slService.deleteIngredient(this.editedItemIndex)
    this.onReset();
  }
}
