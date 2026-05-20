import React from "react";
import { HiClock, HiLightningBolt, HiOutlineClipboardList, HiSpeakerphone } from "react-icons/hi";
import Card from "../components/common/Card";
import { warRoomBoard } from "../services/mockData";

const WarRoom = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="page-container">
        <div className="mb-8 max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-400">Scout War Room</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
            The operating view for <span className="gradient-text">decisions in motion</span>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-dark-300">
            Priority fixtures, pending calls, and next actions in one place so tomorrow's presentation feels grounded in real workflow.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {warRoomBoard.priorities.map((item, index) => (
            <Card key={item.label} className="p-5">
              {index === 0 ? (
                <HiLightningBolt className="mb-3 h-5 w-5 text-primary-400" />
              ) : index === 1 ? (
                <HiOutlineClipboardList className="mb-3 h-5 w-5 text-primary-400" />
              ) : index === 2 ? (
                <HiSpeakerphone className="mb-3 h-5 w-5 text-primary-400" />
              ) : (
                <HiClock className="mb-3 h-5 w-5 text-primary-400" />
              )}
              <p className="text-sm text-dark-400">{item.label}</p>
              <p className="mt-2 text-3xl font-bold text-white">{item.value}</p>
              <p className="mt-1 text-xs text-dark-500">{item.note}</p>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="p-6">
            <div className="mb-5 flex items-center gap-2">
              <HiOutlineClipboardList className="h-5 w-5 text-primary-400" />
              <h2 className="text-xl font-bold text-white">Decision pipeline</h2>
            </div>
            <div className="space-y-4">
              {warRoomBoard.pipeline.map((stage) => (
                <div key={stage.stage} className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{stage.stage}</p>
                      <p className="mt-1 text-sm text-dark-400">{stage.owner}</p>
                    </div>
                    <span className="rounded-full bg-primary-500/10 px-2.5 py-1 text-xs font-semibold text-primary-300">
                      {stage.items.length} profiles
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {stage.items.map((item) => (
                      <span key={item} className="rounded-full border border-white/10 bg-dark-950/60 px-3 py-1 text-xs font-medium text-dark-200">
                        {item}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-dark-300">{stage.action}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-8">
            <Card className="p-6">
              <div className="mb-5 flex items-center gap-2">
                <HiClock className="h-5 w-5 text-primary-400" />
                <h2 className="text-xl font-bold text-white">Next 12 hours</h2>
              </div>
              <div className="space-y-4">
                {warRoomBoard.timeline.map((item) => (
                  <div key={`${item.time}-${item.title}`} className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="min-w-[64px] rounded-lg bg-primary-500/10 px-3 py-2 text-center text-sm font-semibold text-primary-300">
                        {item.time}
                      </div>
                      <p className="font-semibold text-white">{item.title}</p>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-dark-300">{item.detail}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="mb-5 flex items-center gap-2">
                <HiSpeakerphone className="h-5 w-5 text-primary-400" />
                <h2 className="text-xl font-bold text-white">Active alerts</h2>
              </div>
              <div className="space-y-3">
                {warRoomBoard.alerts.map((alert) => (
                  <div key={alert} className="rounded-xl border border-white/5 bg-dark-900/50 p-4 text-sm leading-relaxed text-dark-300">
                    {alert}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarRoom;
