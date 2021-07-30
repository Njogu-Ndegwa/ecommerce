
export default async function getData() {
    const url = "http://localhost:5000/charts"
    const response = await fetch(url).then(res => res.json())
    console.log(response)
    return response
  }