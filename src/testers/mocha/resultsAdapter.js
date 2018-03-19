import isEmptyObject from '@bit/bit.utils.validation.empty';

const normalizeError = (err) => {
    return {
      message: err.message,
      stack: err.stack
    };
}

const normalizeStats = (stats) => {
    return {
      start: stats.start,
      end: stats.end
    };
}

const normalizeTest = (test) => {
    const isError = !isEmptyObject(test.err);

    return ({
      title: test.fullTitle,
      pass: !isError,
      err: isError ? normalizeError(test.err) : null,
      duration: test.duration
    });
}

const normalizeFailure = (failure) => {
    const isError = !isEmptyObject(failure.err);

    return ({
      title: failure.fullTitle,
      err: isError ? normalizeError(failure.err) : null,
      duration: failure.duration
    });
}

const convertMochaFormatToBitFormat = (mochaJsonResults) => {
    return {
      tests: mochaJsonResults.tests.map(normalizeTest),
      stats: normalizeStats(mochaJsonResults.stats),
      failures: mochaJsonResults.generalFailures.map(normalizeFailure)
    };
  }

export default convertMochaFormatToBitFormat;