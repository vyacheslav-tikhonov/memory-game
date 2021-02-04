<template>
  <div class="game">
    <div class="nav">
      <router-link to="/leaders">
        <img class="icon" alt="Leaders" src="../../assets/icons/trophy.svg">
      </router-link>
    </div>

    <div class="game__buttons">
      <div
        v-if="!victory"
      >
        <div v-show=isGameRunning>
          <Button
            @click="onPauseGame()"
          >
            Pause
          </Button>
        </div>
      </div>
    </div>

    <div class="game__timer">
      <Timer ref="timer" />
    </div>

    <div class="cards-container">
      <div
        class="centered-buttons"
      >
        <div
          class="victory"
          v-if="victory">
          Victory!
        </div>
        <div
          v-show="!isGameRunning && !victory">
          <Button
            @click="onStartGame()"
          >
            Start
          </Button>
        </div>
        <div v-if="victory">
          <Button
            @click="onResetGame()"
          >
            New game
          </Button>
        </div>
      </div>
    <div
      class="cards"
    >
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="card-container"
      >
        <GameCard
          v-if="card !== 0"
          :show="displayedIndexes.includes(index)"
          :clickable="!isFreezing"
          :name="card"
          @click="onClick(index)"
        />
      </div>
    </div>
    </div>

  <div
    v-if="showLeadersDialog"
    class="leaders-dialog">
    <p>Save your results</p>
    <input
      class="leaders-dialog__input"
      placeholder="Name"
      v-model="gameName"
    >

    <div class="leaders-dialog__buttons">
      <Button @click="onCloseDialog()">
        Close
      </Button>
      <Button
        :disabled="isNameNotEmpty"
        @click="onSaveGame()">
        Save
      </Button>
    </div>
  </div>

  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref } from 'vue-property-decorator';
import Timer from '@/components/Game/Timer/Timer.vue';
import GameCard from '@/components/ui/cards/GameCard/GameCard.vue';
import { shuffleArray } from '@/utils/array';
import { Leader } from './types';
import Button from '@/components/ui/button/Button.vue';

@Component({
  components: { Timer, GameCard, Button },
})
export default class Game extends Vue {
  @Ref('timer') readonly timer!: Timer;

  private isGameRunning = false;
  private isFreezing = true;
  private victory = false;
  private leadersPlace: number | null = null;
  private showLeadersDialog = false;
  private gameName = '';

  private displayedIndexes: number[] = []
  private currentElementIndex: number | null = null;
  private cardForHiding: null | {time: number; index: number} = null;

  private cards: number[] = [];

  private get isNameNotEmpty() {
    return this.gameName.length <= 0;
  }

  private checkVictory() {
    return !this.cards.reduce((sum, current) => sum + current , 0);
  }

  private onResetGame() {
    this.onPauseGame()
    this.initCards();
    this.timer.clearTimer();
    this.victory = false;
    this.leadersPlace = null;
    this.showLeadersDialog = false;
    this.gameName = '';
    this.onStartGame();
  }

  private onStartGame() {
    this.isGameRunning = true;
    this.timer.startTimer();
    this.isFreezing = false;
  }

  private onPauseGame() {
    this.isGameRunning = false;
    this.cardForHiding = null;
    this.currentElementIndex = null;
    this.displayedIndexes = [];
    this.isFreezing = true;
    this.timer.stopTimer();
  }

  private onCloseDialog() {
    this.showLeadersDialog = false;
  }

  private onSaveGame() {
    this.showLeadersDialog = false;
    if (this.leadersPlace !== null) {
      let leaders: Leader[] = [];
      let leadersJson = localStorage.getItem('leaders');

      if (leadersJson) {
        leaders = JSON.parse(leadersJson);
      }

      const time = this.timer.getTime();

      leaders.push({
        time,
        gameName: this.gameName,
      });
      leaders.sort();

      leadersJson = JSON.stringify(leaders.slice(0, 10));
      localStorage.setItem('leaders', leadersJson);
    }
  }

  private initCards() {
    const cards: number[] = [];
    for (let i = 1; i <= 18; i++) {
      cards.push(i, i);
    }

    this.cards = shuffleArray(cards);
  }

  private recordVictory() {
    this.victory = true;
    this.timer.stopTimer();

    const time = this.timer.getTime();

    const leadersPlace = this.checkLeadersPlace(time);
    if (leadersPlace < 10) {
      this.leadersPlace = leadersPlace;
      this.showLeadersDialog = true;
    }
  }

  private checkLeadersPlace(time: number) {
    const leadersJson = localStorage.getItem('leaders');
    if (leadersJson) {
      const leaders = JSON.parse(leadersJson);
      leaders.forEach((leader: Leader, index: number) => {
        if (time < leader.time) {
          return index;
        }
      });
      return leaders.length;
    }
    return 0;
  }

  private clearEqual(index: number) {
    this.isFreezing = true;   
    this.displayedIndexes.push(index)
    setTimeout(() => { 
        if(this.currentElementIndex !== null) {
          this.cards[this.currentElementIndex] = 0
        }
        this.cards[index] = 0
        this.displayedIndexes = [];
        this.currentElementIndex = null;
        this.cardForHiding = null;
        this.isFreezing = false;
        if (this.checkVictory()) {
          this.recordVictory()
        }
      }
      , 1000);
  }

  private clearNotEqual(index: number) {
    this.isFreezing = true;
    this.displayedIndexes.push(index);
    setTimeout(() => { 
      this.currentElementIndex = null;
      this.displayedIndexes = [];
      this.cardForHiding = null;
      this.isFreezing = false;
      }
      , 500);
  }

  private setCurrentIndex(index: number) {
    this.currentElementIndex = index;
    this.displayedIndexes = [index];
    this.cardForHiding = {
      time: Date.now() + 3000,
      index,
    }
  }

  private onClick(index: number) {
    if (!this.isFreezing) {
      if (this.currentElementIndex !== null) {
        if (
          this.currentElementIndex !== index &&
          this.cards[this.currentElementIndex] === this.cards[index]
          ) {
            this.clearEqual(index);
        } else {
          this.clearNotEqual(index);
        }
      } else {
        this.setCurrentIndex(index);
      }
    }
  }

  private hideCard() {
    if (this.cardForHiding) {
      const time = Date.now()

      if (this.cardForHiding.time <= time) {
        this.displayedIndexes = [];
        this.currentElementIndex = null;
        this.cardForHiding = null;
      }
    }
  }

  private mounted() {
    this.initCards();
    setInterval(this.hideCard, 1000);
  }
}
</script>

<style scoped lang="scss">
.game {
  &__buttons {
    display: flex;
    justify-content: center;
    height: 40px;
  }
  &__timer {
    text-align: center;
    height: 40px;
    padding: 5px 0;
  }
}

.nav {
  padding-bottom: 20px;
}

.cards {
  width: max-content;
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(6, 105px);
  grid-row-gap: 5px;
  position: relative;
}

.card-container {
  width: 100px;
  height: 100px;
}

.cards-container {
  position: relative;
  display: flex;
  justify-content: center;
}

.centered-buttons {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
  text-align: center;
  transform: translate(-50%, -50%);
}

.icon {
  height: 24px;
  width: 24px;
}

.leaders-dialog {
  font-size: 18px;
  background: #fff;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 1px 1px 2px #c6c6c6;
  width: max-content;
  padding: 20px;
  width: 340px;
  border-radius: 4px;
  z-index: 2;

  &__input {
    width: 320px;
  }

  &__buttons {
    padding: 10px 0;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}

.victory {
  font-size: 24px;
  color: rgb(132, 206, 235);
  margin: 10px 0;
}
</style>