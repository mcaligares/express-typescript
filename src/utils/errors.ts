const ERROR = {
  MOOD: {
    CREATED: {
      code: 101,
      message: ''
    },
    CREATED_HASHTAG: {
      code: 102,
      message: ''
    }
  },
  POST: {
    CREATED: {
      code: 103,
      message: ''
    },
    CREATED_HASHTAG: {
      code: 104,
      message: ''
    },
    REPORT_FAIL: {
      code: 107,
      message: 'The User can\'t report two times the same post.',
    }
  },
  USER: {
    UPDATED: {
      code: 105,
      messsage: ''
    }
  },
  HABIT: {
    ASSOCIATE_HABIT: {
      code: 106,
      message: 'The habit doesn\'t exists'
    }
  }
};

export default ERROR;
