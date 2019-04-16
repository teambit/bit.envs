import {expect} from 'chai';
import extractFileNameFromPath from '../../src/file/extractFileNameFromPath';
import path from 'path';

describe('extractFileNameFromPath', () => {
    it('should extract file name from full path', () => {
        const fullPath = `src${path.sep}temp${path.sep}name.js`;
        const filename = extractFileNameFromPath(fullPath);
        return expect(filename).to.eql('name');
    });

    it('should extract file name from partial path', () => {
        const fullPath = 'name.js';
        const filename = extractFileNameFromPath(fullPath);
        return expect(filename).to.eql('name');
    });

    it('should extract file name from path with more than one dot', () => {
        const fullPath = 'name.spec.js';
        const filename = extractFileNameFromPath(fullPath);
        return expect(filename).to.eql('name.spec');
    });
});