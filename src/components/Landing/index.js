import React from 'react';

function randomNum(num) {
  return Math.floor(Math.random() * num);
}

const list = [
  {
    name: 'Tony Nguyen',
    pod: 'Web',
    title: 'Web Developer',
    imageUrl: 'https://randomuser.me/api/portraits/men/30.jpg'
  },
  {
    name: 'Tiffany Mutchler',
    pod: 'Valkyrie',
    title: 'Account Executive',
    imageUrl: 'https://randomuser.me/api/portraits/women/34.jpg'
  },
  {
    name: 'Jay Bachmayer',
    pod: 'Enclave',
    title: 'Growth Strategist',
    imageUrl: 'https://randomuser.me/api/portraits/men/51.jpg'
  },
  {
    name: 'Katie Levitt',
    pod: 'Pickle',
    title: 'Creative Director',
    imageUrl: 'https://randomuser.me/api/portraits/women/3.jpg'
  }
];

class Landing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: list
    };
  }
  render() {
    return (
      <div>
        <h1>Landing</h1>
        {this.state.list.map((item, index) => (
          <div style={{ display: 'flex', alignItems: 'center' }} key={index}>
            <div>
              <img src={item.imageUrl} alt={item.title} />
            </div>
            <span>
              <a href='#'>{item.name}</a>
            </span>
            <span>{item.title}</span>
            <span>{item.pod}</span>
          </div>
        ))}
      </div>
    );
  }
}

export default Landing;
