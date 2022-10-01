async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch("https://interop-mainnet.hasura.app/v1/graphql", {
    method: "POST",
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

const operationsDoc = `
    query MyQuery($offset: Int) {
      mb_views_nft_metadata_unburned(offset: $offset, limit: 10) {
        media
        price
        title
      }
    }
  `;

function fetchMyQuery(offset) {
  return fetchGraphQL(operationsDoc, "MyQuery", { offset: offset });
}

async function startFetchMyQuery(offset) {
  const { errors, data } = await fetchMyQuery(offset);

  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }

  // do something great with this precious data
    console.log(data);

  const nftMarkup = (data) => {
    return `
    <div class="nft__card">
    <img class="nft__img" src="${data.media}" alt="">
    <h2 class="nft__title">Title: ${data.title}</h2>
    <h3>Price: ${data.price}</h3>
    <div class="">
    category: 
    <select name="category" id="category" >
        <option value="contemp-art">Contemporary Art</option>
        <option value="photography">Photography</option>
        <option value="video-art">Video-Art</option>
        <option value="gen-art">Generative Art</option>
        <option value="vr-ar">VR and AR</option>
      </select>
    </div>
    </div>
`;
  };

  data.mb_views_nft_metadata_unburned.forEach((el) => {
    document
      .querySelector(".nft__list")
      .insertAdjacentHTML("afterbegin", nftMarkup(el));
  });
}

let offsetValue = 50;

startFetchMyQuery(offsetValue);

// document.getElementById("next-page-btn").addEventListener('click' , ()=>{
//   offsetValue+= 10;
//   startFetchMyQuery(offsetValue);
// })

