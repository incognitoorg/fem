package com.fem.entities;

import java.util.List;

import com.google.apphosting.api.DatastorePb.GetResponse.Entity;


public class GroupEntity extends Entity {
	private String groupId;
	private String groupName;
	private String groupType;
	private String groupOwerId;
	private List<ExpenseEntity> expenses;
	private List<IOUEntity> iouInfo;
}
