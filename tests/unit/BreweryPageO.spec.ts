import { shallowMount } from '@vue/test-utils';
import BreweryPageO from '../../src/views/BreweryPageO.vue';
import { describe, expect, test } from 'vitest';

describe('BreweryPageO.vue', () => {
  test('renders BreweryPageO', async () => {
    const wrapper = shallowMount(BreweryPageO);
    expect(wrapper).toBeTruthy();
  });
});
