'use strict';
const img = React.createElement;

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      src: []
    };
  }

  componentDidMount() {
    const KEY = "YwbrwkWGMiYGcTUkf29b8viZVMjRDYYKg2aIpSf8";
    const BASE_URL = "https://api.nasa.gov/planetary/apod?api_key=";
    let url = BASE_URL + KEY;
    fetch(url)
      .then(res => res.json())
      .then(
        (data) => {
          console.log(data);
          this.setState({
            isLoaded: true,
            items: data.items
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (wrong) => {
          this.setState({
            isLoaded: true,
            error: wrong.items
          });
        }
      )
    }

    render() {
      const { error, isLoaded, items } = this.state;
      if (error) {
        return <div>Error: {error.message}</div>;
      } else if (!isLoaded) {
        return <div>Loading...</div>;
      } else {
        return <div style={{
          backgroundImage: url(items.url)
        }}>
          Marc Chiu
        </div>
        }
    }
}

const domContainer = document.getElementById('intro-image');
ReactDOM.render(<MyComponent />, domContainer);
