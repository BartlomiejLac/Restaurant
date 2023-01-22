export class Dish {
    id : string;
    name: string;
    cuisine: string;
    category: string;
    ingredients: string[];
    price: number;
    description: string;
    photos: string[];
    max: number;
    vegan: boolean;
    orderedCount: number;
    reviewAvg: number;
    origMax: number;
  }

export function sampleDish(){
  let baseDish: Dish = new Dish();
  baseDish.name = '';
  baseDish.id = '';
  baseDish.cuisine = '';
  baseDish.category = '';
  baseDish.ingredients = [''];
  baseDish.price = 0;
  baseDish.description = '';
  baseDish.photos = ['',''];
  baseDish.max = 0;
  baseDish.vegan = false;
  baseDish.reviewAvg = 0;
  baseDish.orderedCount = 0;
  baseDish.origMax = 0;
  return baseDish;
}
