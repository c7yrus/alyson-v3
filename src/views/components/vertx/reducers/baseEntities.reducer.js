const initialState = {
  data: {},
  relationships: {},
  aliases: {},
  attributes: {},
  definitions: {
    data: {},
    types: {},
  },
  links: {},
};

const handleReduceAttributeCodes = ( resultantAttributes, currentAttribute ) => {
  resultantAttributes[currentAttribute.attributeCode] = currentAttribute;

  return resultantAttributes;
};

const handleReduceAttributes = ( resultant, current ) => {
  if ( current.baseEntityAttributes ) {
    const existing = resultant[current.code] || {};

    const baseEntityAttributes = current
      .baseEntityAttributes
      .reduce( handleReduceAttributeCodes, existing );

    resultant[current.code] = baseEntityAttributes;
  }

  return resultant;
};

const handleReduceLinks = ( resultant, current ) => {
  const handleCombineLinkValues = link => {
    if ( link.link.linkValue ) {
      resultant[link.link.linkValue] = ({
        ...resultant[link.link.linkValue],
        [link.link.targetCode]: link,
      });
    }
  };

  current.links.forEach( handleCombineLinkValues );

  if ( current.parentCode ) {
    const existingLinks = resultant[current.parentCode]
      ? resultant[current.parentCode].links
      : [];

    if ( existingLinks.indexOf( current.code ) < 0 ) {
      /* Group all the parent codes inside a links array. */
      resultant[current.parentCode] = ({
        ...resultant[current.parentCode],
        links: [
          ...existingLinks,
          current.code,
        ],
      });
    }
  }

  return resultant;
};

const handleReduceDefinitionData = ( resultant, current ) => {
  resultant[current.code] = {
    ...current,
    dataType: current.dataType.typeName,
  };

  return resultant;
};

const handleReduceData = ( resultant, current ) => {
  /* Shortcut to remove properties inside the `current` object. */
  const { baseEntityAttributes, ...wantedData } = current; // eslint-disable-line no-unused-vars

  resultant[current.code] = wantedData;

  return resultant;
};

const handleReduceDefinitionTypes = ( resultant, current ) => {
  const { dataType } = current;

  resultant[dataType.typeName] = dataType;

  return resultant;
};

const handleReduceAskQuestionData = ( resultant, current ) => {
  /* Shortcut to remove properties inside the `current` object. */
  const { dataType, ...wantedData } = current.question.attribute; // eslint-disable-line

  resultant[current.question.attributeCode] = wantedData;

  if (
    wantedData.childAsks != null &&
    wantedData.childAsks instanceof Array &&
    wantedData.childAsks.length > 0
  ) {
    return wantedData.childAsks.reduce( handleReduceAskQuestionData, resultant );
  }

  return resultant;
};

const handleReduceAskQuestionTypes = ( resultant, current ) => {
  const { dataType, childAsks } = current.question.attribute;

  resultant[dataType.typeName] = dataType;

  if (
    childAsks != null &&
    childAsks instanceof Array &&
    childAsks.length > 0
  ) {
    return childAsks.reduce( handleReduceAskQuestionTypes, resultant );
  }

  return resultant;
};

const reducer = ( state = initialState, { type, payload }) => {
  switch ( type ) {
    /**
     * When we receive a base entity, we want to loop through the items in the payload and convert
     * the array of items into a hash map / object. The keys for this object are the `code` property
     * on the item (base entity), and the value is the base entity object (well, most of it).
     * We store this data as the `data` property in the reducer. The reason why we store 'most of'
     * the base entity in `data` is because we want to separate the actual base entity attributes
     * into its own property, as stated below.
     *
     * The `attributes` property in the reducer refers to the actual attributes of the base entity.
     *
     * TODO: explain `links`
     */
    case 'BASE_ENTITY_MESSAGE':
      return {
        ...state,
        data: payload.items.reduce( handleReduceData, state.data ),
        attributes: payload.items.reduce( handleReduceAttributes, state.attributes ),
        links: payload.items.reduce( handleReduceLinks, state.links ),
      };

    /**
     * When we receive attribute data, we are renaming it to `definitions` for semantic purposes.
     * This does not contain real data, but mainly validation rules for getting data / attributes.
     *
     * `definitions` is split into two categories, `data` and `types`. Types are a key/value pair,
     * where the key is the `typeName`, and the value is the type (including the validation rules).
     * This is so that we are not storing any duplicate data and bloating our reducer.
     *
     * The `data` property in `definitions` holds the actual definition and is stored by the `code`
     * key. The `dataType` property references the corresponding dataType in the `type` category.
     */
    case 'ATTRIBUTE_DATA':
      return {
        ...state,

        definitions: {
          ...state.definitions,
          data: payload.items.reduce( handleReduceDefinitionData, state.definitions.data ),
          types: payload.items.reduce( handleReduceDefinitionTypes, state.definitions.types ),
        },
      };

    /**
     * TODO:
     * Documentation
     */
    case 'ASK_DATA':
      return {
        ...state,

        definitions: {
          ...state.definitions,
          data: payload.items.reduce( handleReduceAskQuestionData, state.definitions.data ),
          types: payload.items.reduce( handleReduceAskQuestionTypes, state.definitions.types ),
        },
      };

    default:
      return state;
  }
};

export default reducer;
