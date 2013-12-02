/* global Ember */

var App = Ember.Application.create();

App.ApplicationController = Ember.Controller.extend({

    characterRepeatedTimes: function(times, char) {
        return Array(times + 1).join(char).slice(0, times + char.length);
    },

    min: function(a, b) {
        return a < b ? a : b;
    },


    override: localStorage.override,
    overrideChanged: function() {
        localStorage.override = this.get('override');
    }.observes('override'),

    character: localStorage.character || '%',
    characterChanged: function() {
        localStorage.character = this.get('character');
    }.observes('character'),

    text: '',

    linesArray: function() {
        return this.get('text').split('\n');
    }.property('text'),

    maxLen: function() {
        if (this.get('override')) {
            return parseInt(this.get('override'), 10);
        }
        else {
            return this.get('linesArray').reduce(function(prev, cur) {
                return (prev > cur.length ? prev : cur.length);
            }, 0);
        }
    }.property('linesArray', 'override'),

    styleA: function() {
        var result = [];
        var self = this;
        var maxLen = self.get('maxLen');
        result.push(self.characterRepeatedTimes(self.get('maxLen') + 2 + 2 * self.get('character').length, self.get('character')));

        self.get('linesArray').forEach(function(l) {
            result.push(self.get('character') + ' ' + l.slice(0, maxLen) + self.characterRepeatedTimes(maxLen - self.min(maxLen, l.length) + 1, ' ') + self.get('character'));
        });

        result.push(self.characterRepeatedTimes(self.get('maxLen') + 4, self.get('character')));
        return result.join('\n');
    }.property('override', 'character', 'text'),

    styleB: function() {

        var result = [];
        var self = this;
        var maxLen = self.get('maxLen');
        var character = self.get('character');

        self.get('linesArray').forEach(function(l) {

            var remainingSpaceToBeFilled = maxLen - l.length;
            var spaceLeft = Math.round(remainingSpaceToBeFilled / 2);
            var spaceRight = remainingSpaceToBeFilled - spaceLeft;

            result.push(self.characterRepeatedTimes(spaceLeft + 1, character) + ' ' + l + ' ' + self.characterRepeatedTimes(spaceRight + 1, character));
        });
        return result.join('\n');
    }.property('override', 'character', 'text')
});