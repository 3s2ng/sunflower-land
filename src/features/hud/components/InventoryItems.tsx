import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import { Box } from "components/ui/Box";
import { OuterPanel, Panel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { InventoryItemName } from "features/game/types/game";

import { SEEDS, CROPS } from "features/game/types/crops";
import { FOODS, TOOLS, LimitedItems } from "features/game/types/craftables";
import { RESOURCES } from "features/game/types/resources";

import arrowLeft from "assets/icons/arrow_left.png";
import arrowRight from "assets/icons/arrow_right.png";
import seed from "assets/crops/beetroot/seed.png";
import crop from "assets/crops/sunflower/crop.png";
import tool from "assets/tools/hammer.png";
import nft from "assets/nfts/gnome.png";
import food from "assets/crops/wheat/flour.png";
import resource from "assets/resources/wood.png";

import close from "assets/icons/close.png";

interface Props {
  onClose: () => void;
}

type Tab = "Seeds" | "Crops" | "Tools" | "NFTs" | "Foods" | "Resources";

export const CATEGORIES: Record<Tab, { img: string; items: object }> = {
  Seeds: {
    img: seed,
    items: SEEDS(),
  },
  Crops: {
    img: crop,
    items: CROPS(),
  },
  Tools: {
    img: tool,
    items: TOOLS,
  },
  NFTs: {
    img: nft,
    items: LimitedItems,
  },
  Foods: {
    img: food,
    items: FOODS,
  },
  Resources: {
    img: resource,
    items: RESOURCES,
  },
};

export const InventoryItems: React.FC<Props> = ({ onClose }) => {
  const { gameService, selectedItem, shortcutItem } = useContext(Context);
  const [currentTab, setCurrentTab] = useState<Tab>("Seeds");
  const [game] = useActor(gameService);
  const inventory = game.context.state.inventory;

  const tabSequence = Object.keys(CATEGORIES) as Tab[];
  const items = Object.keys(inventory) as InventoryItemName[];
  const validItems = items.filter(
    (itemName) => !!inventory[itemName] && !inventory[itemName]?.equals(0)
  );
  const isCategoryEmpty = !validItems.some(
    (itemName) => itemName in CATEGORIES[currentTab].items
  );
  const len = Object.keys(CATEGORIES).length;

  const getCurrentTabIndex = () => tabSequence.indexOf(currentTab);

  const nextCategory = () => {
    const index = getCurrentTabIndex();
    setCurrentTab(index === len - 1 ? tabSequence[0] : tabSequence[index + 1]);
  };

  const prevCategory = () => {
    const index = getCurrentTabIndex();
    setCurrentTab(index === 0 ? tabSequence[len - 1] : tabSequence[index - 1]);
  };

  return (
    <Panel className="pt-5 relative inventory">
      <img
        src={close}
        className="absolute h-6 cursor-pointer"
        style={{ top: "2%", right: "1%", zIndex: "1" }}
        onClick={onClose}
      />
      <div className="flex justify-center absolute mt-1 top-2 left-0.5 right-0 items-center">
        <img
          className="mr-5 hover:opacity-80 cursor-pointer h-6"
          src={arrowLeft}
          onClick={prevCategory}
        />
        {tabSequence.map((category) => (
          <div
            key={category}
            className={`${
              currentTab === category ? "" : "hidden"
            } flex items-center justify-center`}
            style={{ minWidth: "10rem" }}
          >
            <div>
              <img src={CATEGORIES[category].img} className="h-5" />
            </div>
            <span className="text-sm text-shadow ml-2">{category}</span>
          </div>
        ))}
        <img
          className="ml-5 hover:opacity-80 cursor-pointer h-6"
          src={arrowRight}
          onClick={nextCategory}
        />
      </div>

      <div className="flex">
        <div className="w-3/5 flex flex-wrap h-fit">
          {isCategoryEmpty ? (
            <span className="text-white text-shadow">
              You have no {currentTab} in your inventory.
            </span>
          ) : (
            validItems.map(
              (itemName) =>
                itemName in CATEGORIES[currentTab].items && (
                  <Box
                    count={inventory[itemName]}
                    isSelected={selectedItem === itemName}
                    key={itemName}
                    onClick={() => shortcutItem(itemName)}
                    image={ITEM_DETAILS[itemName].image}
                  />
                )
            )
          )}
        </div>

        <OuterPanel className="flex-1">
          {selectedItem && (
            <div className="flex flex-col justify-center items-center p-2">
              <span className="text-base text-center text-shadow">
                {selectedItem}
              </span>
              <img
                src={ITEM_DETAILS[selectedItem].image}
                className="h-12 w-12"
                alt={selectedItem}
              />
              <span className="text-xs text-shadow text-center mt-2">
                {ITEM_DETAILS[selectedItem].description}
              </span>
            </div>
          )}
        </OuterPanel>
      </div>
    </Panel>
  );
};
