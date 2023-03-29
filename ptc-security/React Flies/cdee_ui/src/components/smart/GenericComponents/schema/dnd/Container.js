/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import withDragDropContext  from '../../../../../lib/withDragDropContext';
import SourceBox from './SourceBox';
import TargetBox from './TargetBox';

class Container extends React.Component {
  constructor(props) {
    super(props);

  }

  componentWillMount() {
//    SAMPLE
  }

  render() {
    return (
      <div style={{ overflow: 'hidden', clear: 'both', marginTop: '1.5rem' }}>
        <div style={{ float: 'left' }}>
          <SourceBox showCopyIcon />
          <SourceBox />
        </div>
        <div style={{ float: 'left' }}>
          <TargetBox />
        </div>
      </div>
    );
  }
}

Container.propTypes = {
  store: React.PropTypes.object
};
export default withDragDropContext(Container);
