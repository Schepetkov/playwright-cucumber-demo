import { Page } from '@playwright/test';
import BasePage from './basePage';

export default class WidgetsPage extends BasePage {
  constructor(protected page: Page) {
    super(page);
  }

  public PageElements = {
    ProgressBarId: '#progressBar',
    ProgressBarElement: '.progress-bar',
    ToolTipButtonId: '#toolTipButton',
    TooltipElement: '.tooltip-inner',
    TooltipText: 'You hovered over the Button',
    DropZoneId: '#droppable',
    DropZoneClassAttributeValue: 'drop-box ui-droppable ui-state-highlight',
    DraggableElementId: 'div#draggable',
    DropContainer: '#simpleDropContainer',
  };
}
