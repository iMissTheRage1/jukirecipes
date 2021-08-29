import React from "react";
import { useQuery } from "react-query";
import { useParams, Link } from "react-router-dom";
import BlockContent from "@sanity/block-content-to-react";
import { sanity, imageUrlBuilder } from "../../sanity";
import styles from "./Recipe.module.scss";
import FilterSelect from "../FilterSelect";

const query = `
  *[ _type == 'recipe' && slug.current == $slug ]
`;

const images = ["a", "b", "c", "d"];
const tags = ["Noodles", "Soup"];
const Recipe = () => {
  // this variable is populated from `react-router` which pulls it from the URL
  const { slug } = useParams();

  // data is fetched from sanity via the sanity client and stored into
  // application state via react-query. note that the slug is used as the
  // "query key": https://react-query.tanstack.com/guides/query-keys
  const { data = [] } = useQuery(slug, () => sanity.fetch(query, { slug }));

  // we'll use destructuring assignment to return the first mab lib
  const [recipe] = data;

  if (!recipe) {
    return <h1>Loading…</h1>;
  }

  // once the mad lib is loaded, we can map through the structured content to
  // find our placeholder shape. the end result is an array of these placeholders
  return (
    <div className={styles.recipeWrapper}>
      <div className={styles.recipeInfoWrapper}>
        <Link className={styles.button} to="/">
          ← More Recipes
        </Link>
        <div className={styles.recipeInfo}>
          <img
            className={styles.img}
            alt={recipe.title}
            src={imageUrlBuilder
              .width(240)
              .height(240)
              .image(recipe.image)
              .url()}
          />
          <div className={styles.recipeInfoDiv}>
            <div>
              <h1 className={styles.title}>{recipe.title}</h1>
              <div className={styles.filterDisplay}>
                <FilterSelect
                  selected={tags}
                  setSelected={() => void 0}
                  values={tags}
                />
              </div>
            </div>
            <div className={styles.imageGallery}>
              {images.map((image, index) => (
                <img
                  key={image + index}
                  className={styles.img}
                  alt={recipe.title}
                  src={imageUrlBuilder
                    .width(80)
                    .height(80)
                    .image(recipe.image)
                    .url()}
                />
              ))}
            </div>
          </div>
        </div>
        <div className={styles.recipeInstructions}>
          <h2>Instructions</h2>
          <BlockContent
            className={styles.blockContent}
            blocks={recipe.instructions}
          />
        </div>
      </div>
      <div className={styles.recipeIngredientsWrapper}>
        <BlockContent
          className={styles.blockContent}
          blocks={recipe.ingredients}
        />
      </div>
    </div>
  );
};

export default Recipe;
