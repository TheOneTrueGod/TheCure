'use strict';

class ProgressBar extends React.Component {
  constructor(props) {
    super(props);
    this.width = (this.props.width ? this.props.width : "100%");
  }

  render() {
    let percent =
      Math.max(0,
        Math.min(1,
          (this.props.curr - this.props.start) / (this.props.end - this.props.start)
        )
      );
    percent = (percent * 100) + "%";

    return React.createElement(
      'div',
      {
        className: "progressBarBorder",
        style: { width: this.width }
      },
      React.createElement(
        'div',
        {
          className: "progressBarProgress",
          style: { width: percent, height: "100%", background: this.props.color || null }},
      ),
      React.createElement(
        'div',
        {
          className: "progressBarText",
        },
        "" + Math.min(this.props.curr - this.props.start, this.props.end - this.props.start)
      )
    );
  }
}
