
export default async function getData() {
    const url = "http://localhost:3000/charts"
    const response = await fetch(url).then(res => res.json())
    return response
  }