import { useState } from 'react';

const useLoginState = () => {
   const [state, setState] = useState({authorized: false});

   const actions = (action) => {
      const {type, payload} = action;
      switch (type) {
         case 'setState':
            return setState(payload);
         default:
            return state;
      }
   }
   return {state, actions};
}

export default useLoginState;
