/* Pelletkachel Card 1.2.1 — dependency-free Home Assistant custom card.
 * Texts belong in card YAML: title, subtitle and labels. Protocol values stay fixed.
 * SPDX-License-Identifier: MIT. Copyright (c) 2026 MCZ ESPHome contributors.
 */
(() => {
  const LABELS = Object.freeze({
    target: 'Gewenst', decrease: 'Temperatuur verlagen', increase: 'Temperatuur verhogen',
    source_ha: 'HA', source_remote: 'Afstandsbediening',
    no_temperature: 'Geen geldige livingtemperatuur. Auto kan niet starten.',
    living: 'Living', heating: 'Verwarming', mode: 'Modus', power: 'Vermogen',
    fans: 'Ventilatoren', fan1: 'Ventilator 1', fan2: 'Ventilator 2',
    auto: 'Auto', manual: 'Manueel', eco: 'Eco', fan_off: '0',
    turn_on: 'Aanzetten', turn_off: 'Uitzetten', apply: 'Instellingen toepassen',
    last_command: 'Laatste opdracht', on_requested: 'Aan gevraagd',
    off_requested: 'Uit gevraagd', unknown: 'Onbekend', unavailable: 'Niet beschikbaar',
    footer: 'Status op basis van opdrachten',
    off_hint: 'Bij aanzetten worden deze instellingen gebruikt.',
    unknown_hint: 'Nog geen opdracht ontvangen sinds de herstart.',
    pending: 'Bezig…', error: 'Opdracht mislukt. Probeer opnieuw.',
    missing: 'Controleer de entity-ID’s in de kaartconfiguratie:',
    configure: 'Configureer entities.{key} met een {domain}-entiteit.',
  });
  const DOMAINS = { temperature: 'sensor', target: 'number', last_command: 'sensor', command_mode: 'sensor',
    mode: 'select', power: 'number', fan1: 'select', fan2: 'select',
    turn_on: 'button', turn_off: 'button', apply: 'button' };
  const CSS = `
    :host{display:block;--mcz-accent:var(--warning-color,#ef8500);color:var(--primary-text-color,#212121)}
    *{box-sizing:border-box}ha-card{display:block;overflow:hidden;border-radius:var(--ha-card-border-radius,16px);background:var(--ha-card-background,var(--card-background-color,#fff));border:1px solid var(--divider-color,#e4e4e4);font-family:var(--paper-font-body1_-_font-family,Roboto,Arial,sans-serif)}
    .wrap{padding:20px}header{display:flex;gap:12px;align-items:center;padding-bottom:18px}
    .flame{--mdc-icon-size:34px;color:var(--mcz-accent)}h2{font-size:22px;line-height:1.25;margin:0;font-weight:600;overflow-wrap:anywhere}.subtitle{font-size:14px;color:var(--secondary-text-color,#727272);margin-top:4px;overflow-wrap:anywhere}
    .status{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 0;border-top:1px solid var(--divider-color,#eee)}
    .setpoint-controls{display:flex;align-items:center;gap:8px}.setpoint-controls button{width:34px;padding:5px;min-height:36px;font-size:22px}.setpoint-controls .degrees{font-size:24px;white-space:nowrap}.setpoint .caption{text-align:center}
    .pill{display:inline-block;padding:9px 12px;background:var(--secondary-background-color,#f5f5f5);border-radius:10px;font-size:16px;font-weight:600}
    .pill.on{background:color-mix(in srgb,var(--mcz-accent) 13%,transparent);color:var(--mcz-accent)}.caption{font-size:12px;color:var(--secondary-text-color,#727272);margin-top:6px}.temp{text-align:right;flex-shrink:0}.degrees{font-size:27px;font-weight:600;line-height:1.2}
    section{border-top:1px solid var(--divider-color,#eee);padding-top:16px;margin-top:3px}.section-title{font-size:12px;letter-spacing:1px;text-transform:uppercase;color:var(--secondary-text-color,#727272);font-weight:600;margin:0 0 13px}
    button{font:inherit;color:inherit;cursor:pointer;border:1px solid var(--divider-color,#dedede);background:var(--secondary-background-color,#f7f7f7);min-height:42px;padding:8px 10px;border-radius:9px;transition:background .12s;overflow-wrap:anywhere}
    button:hover:not(:disabled){filter:brightness(.96)}button:focus-visible{outline:3px solid var(--primary-color,#03a9f4);outline-offset:2px}button:disabled{opacity:.45;cursor:not-allowed}
    .power-controls{display:flex;gap:8px;margin-bottom:15px}.power-controls button{flex:1;font-size:17px;min-height:48px;display:flex;gap:9px;align-items:center;justify-content:center}.power-controls ha-icon{--mdc-icon-size:22px}
    .row{display:grid;grid-template-columns:82px minmax(0,1fr);align-items:center;gap:10px;margin:12px 0}.row-label{font-size:14px;overflow-wrap:anywhere}.segments{display:flex;min-width:0}.segments button{border-radius:0;flex:1;min-width:0;padding:7px 3px;font-size:13px}.segments button+button{border-left-width:0}.segments button:first-child{border-radius:8px 0 0 8px}.segments button:last-child{border-radius:0 8px 8px 0}
    button.selected{background:var(--mcz-accent);border-color:var(--mcz-accent);color:#fff;font-weight:600}
    .fan{margin-bottom:15px}.fan-label{display:flex;align-items:center;gap:8px;margin-bottom:9px;font-size:15px;overflow-wrap:anywhere}.fan-label ha-icon{--mdc-icon-size:22px}.apply{width:100%;margin-top:4px;background:transparent;font-weight:600}
    .hint,.footer{font-size:12px;line-height:1.45;color:var(--secondary-text-color,#727272);margin-top:10px}.footer{text-align:center}.error{font-size:13px;line-height:1.5;background:color-mix(in srgb,var(--error-color,#db4437) 10%,transparent);padding:10px;border-radius:8px;overflow-wrap:anywhere;margin-top:12px}
    @media(max-width:360px){.wrap{padding:14px}.row{grid-template-columns:1fr;gap:6px}h2{font-size:20px}.degrees{font-size:23px}.pill{font-size:14px}}
  `;
  function element(tag, text, className) {
    const el = document.createElement(tag);
    if (text !== undefined) el.textContent = text;
    if (className) el.className = className;
    return el;
  }
  class PelletkachelCard extends HTMLElement {
    constructor() {
      super(); this.attachShadow({mode:'open'}); this._busy = false;
    }
    setConfig(config) {
      const labels = {...LABELS, ...(config?.labels || {})};
      for (const [key, domain] of Object.entries(DOMAINS)) {
        const id = config?.entities?.[key];
        if (typeof id !== 'string' || !new RegExp(`^${domain}\\.[a-z0-9_]+$`).test(id)) {
          throw new Error(labels.configure.replace('{key}',key).replace('{domain}',domain));
        }
      }
      this._config = {title:'Pelletkachel',subtitle:'MCZ Ego Air 2.0',...config,
        entities:{...config.entities},labels};
      this._signature = ''; this._render();
    }
    set hass(hass) {
      this._hass = hass;
      if (!this._config) return;
      const sig = JSON.stringify(Object.values(this._config.entities).map(id => hass.states[id]));
      if (sig !== this._signature) {this._signature = sig;this._render();}
    }
    get hass() {return this._hass;}
    getCardSize() {return 8;}
    getGridOptions() {return {columns:12,rows:'auto',min_columns:6};}
    _text(key) {return String(this._config.labels[key] ?? LABELS[key] ?? key);}
    _entity(key) {return this._hass?.states[this._config.entities[key]];}
    _available(key) {
      const state = this._entity(key)?.state;
      // Buttons normally have 'unknown' before their first press. They are usable.
      return state !== undefined && state !== 'unavailable' &&
        (DOMAINS[key] === 'button' || state !== 'unknown');
    }
    _command() {
      const value = this._entity('command_mode')?.state;
      if (['MANUAL','AUTO','ECO'].includes(value)) return 'on';
      if (value === 'OFF') return 'off';
      return 'unknown';
    }
    _button(text, key, callback, disabled=false, selected=false) {
      const b=element('button',text,selected?'selected':''); b.type='button';
      b.dataset.focusKey=key;b.disabled=disabled || this._busy;
      b.addEventListener('click',callback);return b;
    }
    _icon(name) {const i=element('ha-icon');i.setAttribute('icon',name);return i;}
    async _call(key, service, data={}) {
      // Never use 'toggle': send explicit ON or OFF, based on the shown command.
      if (this._busy || !this._available(key) || !this._available('command_mode')) return;
      this._busy=true;this._error='';this._render();
      try {
        await this._hass.callService(DOMAINS[key],service,{entity_id:this._config.entities[key],...data});
      } catch(error) {
        this._error=this._text('error');
        console.error('Pelletkachel Card: service call failed',error);
      } finally {this._busy=false;this._render();}
    }
    _choiceMatches(key, value) {
      const state = this._entity(key)?.state;
      return DOMAINS[key] === 'number' ? Number(state) === Number(value) : state === String(value);
    }
    async _setChoice(key, value) {
      if (!this._available(key) || !this._available('command_mode')) throw Error('Device unavailable');
      if (this._choiceMatches(key, value)) return;
      if (DOMAINS[key] === 'select' && !this._entity(key).attributes.options?.includes(String(value))) {
        throw Error(`Unsupported option ${key}: ${value}; update ESPHome first`);
      }
      await this._hass.callService(DOMAINS[key], DOMAINS[key] === 'number' ? 'set_value' : 'select_option', {
        entity_id: this._config.entities[key],
        ...(DOMAINS[key] === 'number' ? {value:Number(value)} : {option:String(value)}),
      });
      // A service response alone does not confirm the ESP32 has updated its choice.
      const deadline = Date.now() + 5000;
      while (!this._choiceMatches(key, value)) {
        if (!this._available(key) || !this._available('command_mode') || Date.now() >= deadline)
          throw Error(`No updated state for ${key}`);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
    async _change(key, value) {
      if (this._busy || !this._available(key) || !this._available('command_mode')) return;
      const wasOn = this._command() === 'on';
      this._busy = true; this._error = ''; this._render();
      try {
        // Only a power click selects MANUAL. Fan clicks never change the mode.
        if (key === 'power') await this._setChoice('mode', 'MANUAL');
        await this._setChoice(key, value);
        if (key !== 'target' && wasOn && this._command() === 'on') {
          if (!['apply','mode','power','fan1','fan2','command_mode'].every(k => this._available(k)))
            throw Error('Device unavailable');
          await this._hass.callService('button', 'press', {entity_id:this._config.entities.apply});
        }
      } catch (error) {
        this._error = this._text('error');
        console.error('Pelletkachel Card: change failed', error);
      } finally { this._busy = false; this._render(); }
    }
    _segments(key, choices, disabled) {
      const group=element('div',undefined,'segments');group.setAttribute('role','group');
      group.setAttribute('aria-label',this._text(key));
      const state=this._entity(key)?.state;
      for (const [value,label] of choices) {
        const selected=this._choiceMatches(key,value);
        const button=this._button(label,`${key}:${value}`,()=>this._change(key,value),
          disabled || !this._available(key) || (key !== 'power' && !this._entity(key)?.attributes.options?.includes(String(value))),selected);
        button.setAttribute('aria-pressed',String(selected));group.append(button);
      }
      return group;
    }
    _render() {
      if (!this._config || !this._hass) return;
      const focus=this.shadowRoot.activeElement?.dataset.focusKey;
      const missing=Object.entries(this._config.entities).filter(([,id])=>!this._hass.states[id]);
      const online=this._available('command_mode');
      const command=this._command();
      const style=element('style',CSS);const card=element('ha-card');const wrap=element('div',undefined,'wrap');card.append(wrap);
      const header=element('header');const icon=this._icon('mdi:fire');icon.className='flame';
      const names=element('div');names.append(element('h2',this._config.title),element('div',this._config.subtitle,'subtitle'));
      header.append(icon,names);wrap.append(header);
      const status=element('div',undefined,'status'),stateBox=element('div',undefined,'setpoint');
      const targetEntity=this._entity('target');
      const target=Number.parseFloat(targetEntity?.state);
      const min=Number(targetEntity?.attributes.min ?? 10),max=Number(targetEntity?.attributes.max ?? 30);
      const step=Number(targetEntity?.attributes.step ?? 0.5);
      const usable=online && this._available('target') && Number.isFinite(target);
      const targetControls=element('div',undefined,'setpoint-controls');
      for (const direction of [-1,1]) {
        const next=Math.round(Math.max(min,Math.min(max,target+direction*step))*10)/10;
        const button=this._button(direction<0?'−':'+',direction<0?'decrease':'increase',
          ()=>this._change('target',next),!usable || (direction<0?target<=min:target>=max));
        button.setAttribute('aria-label',this._text(direction<0?'decrease':'increase'));
        targetControls.append(button);
        if (direction<0) targetControls.append(element('div',Number.isFinite(target)?
          new Intl.NumberFormat(this._hass.locale?.language || this._hass.language || 'nl',
          {minimumFractionDigits:1,maximumFractionDigits:1}).format(target)+' °C':'—','degrees'));
      }
      stateBox.append(targetControls,element('div',this._text('target'),'caption'));
      const temp=element('div',undefined,'temp');const tempState=this._entity('temperature');
      const value=Number.parseFloat(tempState?.state);let formatted='—';
      if (Number.isFinite(value)) {
        formatted=new Intl.NumberFormat(this._hass.locale?.language || this._hass.language || 'nl',
          {minimumFractionDigits:1,maximumFractionDigits:1}).format(value)+' '+(tempState.attributes.unit_of_measurement || '°C');
      }
      temp.append(element('div',formatted,'degrees'),element('div',this._text('living'),'caption'));status.append(stateBox,temp);wrap.append(status);
      const heat=element('section');heat.append(element('div',this._text('heating'),'section-title'));
      const power=element('div',undefined,'power-controls');
      // Unknown state keeps a separate OFF button accessible; never assume OFF.
      for (const key of (command==='on'?['turn_off']:command==='off'?['turn_on']:['turn_on','turn_off'])) {
        const button=this._button(this._text(key),key,()=>this._call(key,'press'),!online || !this._available(key) || (key==='turn_on' && this._entity('mode')?.state==='AUTO' && !Number.isFinite(Number.parseFloat(this._entity('temperature')?.state))));
        button.prepend(this._icon(key==='turn_on'?'mdi:power':'mdi:power-off'));power.append(button);
      }
      heat.append(power);
      for (const [key,choices] of [['mode',[['AUTO',this._text('auto')],['MANUAL',this._text('manual')],['ECO',this._text('eco')]]],
        ['power',[1,2,3,4,5].map(n=>[n,String(n)])]]) {
        const row=element('div',undefined,'row');row.append(element('div',this._text(key),'row-label'),this._segments(key,choices,!online));heat.append(row);
      }
      wrap.append(heat);
      const fans=element('section');fans.append(element('div',this._text('fans'),'section-title'));
      for (const key of ['fan1','fan2']) {
        const fan=element('div',undefined,'fan'),label=element('div',undefined,'fan-label');
        label.append(this._icon('mdi:fan'),element('span',this._text(key)));fan.append(label,
          this._segments(key,[...(key==='fan2'?[['0',this._text('fan_off')]]:[]),...[1,2,3,4,5].map(n=>[String(n),String(n)]),['AUTO',this._text('auto')]],!online));fans.append(fan);
      }
      if (this._busy) fans.append(element('div',this._text('pending'),'hint'));
      if (online && command!=='on') fans.append(element('div',this._text(command==='off'?'off_hint':'unknown_hint'),'hint'));
      let detail=this._text('unknown');
      try {
        const last=JSON.parse(this._entity('last_command')?.state || '{}');
        if (['OFF','AUTO','MANUAL','ECO'].includes(last.mode)) {
          const modeLabel={OFF:'off_requested',AUTO:'auto',MANUAL:'manual',ECO:'eco'}[last.mode];
          const parts=[this._text(last.source==='remote'?'source_remote':'source_ha'),this._text(modeLabel)];
          if (last.mode!=='OFF') {
            parts.push(this._text('power')+' '+last.power);
            for (const key of ['fan1','fan2']) parts.push(this._text(key)+' '+
              (last[key]===6?this._text('auto'):last[key]===0?this._text('fan_off'):last[key]));
          }
          detail=parts.join(' · ');
        }
      } catch (_) { /* A newly created sensor can still be unknown. */ }
      wrap.append(fans,element('div',this._text('last_command')+': '+detail,'footer'));
      if (this._entity('mode')?.state==='AUTO' && !Number.isFinite(value))
        wrap.append(element('div',this._text('no_temperature'),'hint'));
      if (missing.length) wrap.append(element('div',this._text('missing')+' '+missing.map(([,id])=>id).join(', '),'error'));
      if (this._error) {const error=element('div',this._error,'error');error.setAttribute('role','alert');wrap.append(error);}
      this.shadowRoot.replaceChildren(style,card);
      if (focus) [...this.shadowRoot.querySelectorAll('button')].find(b=>b.dataset.focusKey===focus && !b.disabled)?.focus({preventScroll:true});
    }
  }
  if (!customElements.get('pelletkachel-card')) customElements.define('pelletkachel-card',PelletkachelCard);
  window.customCards=window.customCards || [];
  if (!window.customCards.some(c=>c.type==='pelletkachel-card')) window.customCards.push({
    type:'pelletkachel-card',name:'Pelletkachel Card',description:'MCZ-bediening via ESPHome; configureer entiteiten en labels in YAML.',preview:false,
  });
})();
