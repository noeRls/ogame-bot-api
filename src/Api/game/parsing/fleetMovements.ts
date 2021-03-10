import { ElementHandle, Page } from 'puppeteer';
import { FleetMovement, FleetMovementType, FleetReturnFlightType } from '../types';

export async function loadFleetMovements(page: Page): Promise<FleetMovement[]> {
  const elems = await page.$$('[class*="fleetDetails"]');
  const fleetMovementsList: FleetMovement[] = [];
  for (const elem of elems) {
    // console.log('elem : ', elem);
    fleetMovementsList.push(await loadFleetMovementLight(elem, page));
  }
  return fleetMovementsList;
}

export async function loadFleetMovementLight(elem: ElementHandle<Element>, page: Page): Promise<FleetMovement> {
  const id = (await elem.evaluate(e => e.getAttribute('id'))).replace('fleet', '');
  const elemType = await elem.evaluate(e => e.getAttribute('data-mission-type'));
  let type = FleetMovementType.unknown;
  if (elemType === FleetMovementType.attack) {
    type = FleetMovementType.attack;
  } else if (elemType === FleetMovementType.exploit) {
    type = FleetMovementType.exploit;
  } else if (elemType === FleetMovementType.spy) {
    type = FleetMovementType.spy;
  } else if (elemType === FleetMovementType.transport) {
    type = FleetMovementType.transport;
  }
  const elemReturnFLight = await await elem.evaluate(e => e.getAttribute('data-return-flight'));
  let returnFLight = FleetReturnFlightType.unknown;
  if (elemReturnFLight === FleetReturnFlightType.go) {
    returnFLight = FleetReturnFlightType.go;
  } else if (elemReturnFLight === FleetReturnFlightType.return) {
    returnFLight = FleetReturnFlightType.return;
  } else if (elemReturnFLight === FleetReturnFlightType.otherPLayer) {
    returnFLight = FleetReturnFlightType.otherPLayer;
  }
  const arrivalTime = Number(await elem.evaluate(e => e.getAttribute('data-arrival-time')));
  return {
    id,
    __elem: elem,
    type,
    returnFLight,
    arrivalTime
  };
}
